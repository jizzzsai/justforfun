import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anon || !service) throw new Error("Supabase test configuration is missing.");

const client = () => createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
const felix = client();
const james = client();
const createdIds = [];

try {
  const felixLogin = await felix.auth.signInWithPassword({ email: "felix@au.edu", password: "123456789" });
  const jamesLogin = await james.auth.signInWithPassword({ email: "james@au.edu", password: "123456789" });
  assert.ifError(felixLogin.error);
  assert.ifError(jamesLogin.error);
  const felixId = felixLogin.data.user.id;

  for (const grantType of ["au_r3", "au_r4"]) {
    const coMember = grantType === "au_r3"
      ? { name: "James Researcher", kind: "Researcher", email: "james@au.edu" }
      : { name: "James Researcher", type: "Corresponding Author", email: "james@au.edu", contribution: "40" };
    const inserted = await felix.from("applications").insert({
      researcher_id: felixId,
      title: "Collaboration flow verification " + grantType,
      faculty: "Vincent Mary School of Engineering, Science and Technology",
      department: "Information Technology",
      requested_amount: grantType === "au_r3" ? 3500 : 25000,
      grant_type: grantType,
      co_members: [coMember],
      status: "submitted",
      submitted_at: new Date().toISOString(),
    }).select("id,code,title").single();
    assert.ifError(inserted.error);
    createdIds.push(inserted.data.id);

    const pending = await james.from("application_collaborators")
      .select("id,status,application:applications(id,title,grant_type)")
      .eq("application_id", inserted.data.id)
      .single();
    assert.ifError(pending.error);
    assert.equal(pending.data.status, "pending");
    assert.equal(pending.data.application.grant_type, grantType);

    const deniedBefore = await james.from("applications")
      .update({ title: "Unauthorized collaborator edit" })
      .eq("id", inserted.data.id)
      .select("id");
    assert.equal((deniedBefore.data || []).length, 0);

    const accepted = await james.rpc("respond_to_collaboration", {
      p_invitation_id: pending.data.id,
      p_accept: true,
    });
    assert.ifError(accepted.error);
    assert.equal(accepted.data.status, "accepted");

    const ownerView = await felix.from("application_collaborators")
      .select("status,user_id")
      .eq("application_id", inserted.data.id)
      .single();
    assert.ifError(ownerView.error);
    assert.equal(ownerView.data.status, "accepted");

    const visible = await james.from("applications")
      .select("*, researcher:profiles(full_name,email,name_title,title,au_id,phone,office_room), collaborators:application_collaborators(id,user_id,email,full_name,author_role,status,invited_at,responded_at), documents:application_documents(*), reviews(*, reviewer:profiles(full_name,email,title,faculty,department)), events:application_events(*, actor:profiles(full_name)), payments(*), reports(*)")
      .eq("id", inserted.data.id)
      .single();
    assert.ifError(visible.error);
    assert.equal(visible.data.grant_type, grantType);
    assert.ok((visible.data.collaborators || []).some(item => item.status === "accepted"));
    assert.ok((visible.data.events || []).some(event => event.action === "Co-author invitation accepted"));

    const deniedAfter = await james.from("applications")
      .update({ title: "Unauthorized accepted co-author edit" })
      .eq("id", inserted.data.id)
      .select("id");
    assert.equal((deniedAfter.data || []).length, 0);
  }

  console.log("AU-R3 and AU-R4 co-author invitation flow passed.");
} finally {
  if (createdIds.length) await admin.from("applications").delete().in("id", createdIds);
  await felix.auth.signOut();
  await james.auth.signOut();
}
