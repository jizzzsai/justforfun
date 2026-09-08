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
  const people = [
    { owner: felix, ownerId: felixLogin.data.user.id, ownerName: "Felix Researcher", guest: james, guestName: "James Researcher", guestEmail: "james@au.edu" },
    { owner: james, ownerId: jamesLogin.data.user.id, ownerName: "James Researcher", guest: felix, guestName: "Felix Researcher", guestEmail: "felix@au.edu" },
  ];

  for (const grantType of ["au_r3", "au_r4"]) {
    for (const person of people) {
      const coMember = grantType === "au_r3"
        ? { name: person.guestEmail, kind: "Researcher", email: person.guestEmail }
        : { name: person.guestEmail, type: "Corresponding Author", email: person.guestEmail, contribution: "40" };
      const inserted = await person.owner.from("applications").insert({
        researcher_id: person.ownerId,
        title: "Collaboration flow verification " + grantType,
        faculty: "Vincent Mary School of Engineering, Science and Technology",
        department: "Information Technology",
        requested_amount: grantType === "au_r3" ? 3500 : 25000,
        grant_type: grantType,
        co_members: [coMember],
        conference_info: grantType === "au_r3" ? { researcherName: person.ownerName, researcherEmail: person.owner === felix ? "felix@au.edu" : "james@au.edu" } : null,
        pub_info: grantType === "au_r4" ? { researcherName: person.ownerName, contactEmail: person.owner === felix ? "felix@au.edu" : "james@au.edu", applicantRole: "First Author" } : null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      }).select("id,code,title").single();
      assert.ifError(inserted.error);
      createdIds.push(inserted.data.id);

      const pending = await person.guest.from("application_collaborators")
        .select("id,status,email,full_name,author_role,application:applications(id,title,grant_type)")
        .eq("application_id", inserted.data.id)
        .single();
      assert.ifError(pending.error);
      assert.equal(pending.data.status, "pending");
      assert.equal(pending.data.application.grant_type, grantType);
      assert.equal(pending.data.email, person.guestEmail);
      assert.equal(pending.data.full_name, person.guestName);

      const deniedBefore = await person.guest.from("applications")
        .update({ title: "Unauthorized collaborator edit" })
        .eq("id", inserted.data.id)
        .select("id");
      assert.equal((deniedBefore.data || []).length, 0);

      const accepted = await person.guest.rpc("respond_to_collaboration", {
        p_invitation_id: pending.data.id,
        p_accept: true,
      });
      assert.ifError(accepted.error);
      assert.equal(accepted.data.status, "accepted");

      const ownerView = await person.owner.from("application_collaborators")
        .select("status,user_id,full_name,email")
        .eq("application_id", inserted.data.id)
        .single();
      assert.ifError(ownerView.error);
      assert.equal(ownerView.data.status, "accepted");
      assert.equal(ownerView.data.full_name, person.guestName);

      const visible = await person.guest.from("applications")
        .select("*, researcher:profiles(full_name,email,name_title,title,au_id,phone,office_room), collaborators:application_collaborators(id,user_id,email,full_name,author_role,status,invited_at,responded_at), documents:application_documents(*), reviews(*, reviewer:profiles(full_name,email,title,faculty,department)), events:application_events(*, actor:profiles(full_name)), payments(*), reports(*)")
        .eq("id", inserted.data.id)
        .single();
      assert.ifError(visible.error);
      assert.equal(visible.data.grant_type, grantType);
      assert.ok((visible.data.collaborators || []).some(item => item.status === "accepted"));
      assert.ok((visible.data.events || []).some(event => event.action === "Co-author invitation accepted"));

      const deniedAfter = await person.guest.from("applications")
        .update({ title: "Unauthorized accepted co-author edit" })
        .eq("id", inserted.data.id)
        .select("id");
      assert.equal((deniedAfter.data || []).length, 0);
    }
  }

  console.log("AU-R3 and AU-R4 co-author invitation flow passed.");
} finally {
  if (createdIds.length) await admin.from("applications").delete().in("id", createdIds);
  await felix.auth.signOut();
  await james.auth.signOut();
}
