import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testPassword = process.env.TEST_ACCOUNT_PASSWORD || "";
if (!url || !anon || !service || !testPassword) throw new Error("Supabase test configuration or TEST_ACCOUNT_PASSWORD is missing.");

const client = () => createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
const felix = client();
const james = client();
const createdIds = [];

try {
  const felixLogin = await felix.auth.signInWithPassword({ email: "felix@au.edu", password: testPassword });
  const jamesLogin = await james.auth.signInWithPassword({ email: "james@au.edu", password: testPassword });
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

      const invitations = await admin.from("application_collaborators")
        .select("id")
        .eq("application_id", inserted.data.id);
      assert.ifError(invitations.error);
      assert.equal((invitations.data || []).length, 0, "AU-R3/R4 author details must not create account invitations");

      const deniedBefore = await person.guest.from("applications")
        .update({ title: "Unauthorized collaborator edit" })
        .eq("id", inserted.data.id)
        .select("id");
      assert.equal((deniedBefore.data || []).length, 0);

      const visible = await person.guest.from("applications")
        .select("id")
        .eq("id", inserted.data.id)
        .maybeSingle();
      assert.ifError(visible.error);
      assert.equal(visible.data, null, "Listed authors must not gain access to another researcher's application");

      const deniedAfter = await person.guest.from("applications")
        .update({ title: "Unauthorized accepted co-author edit" })
        .eq("id", inserted.data.id)
        .select("id");
      assert.equal((deniedAfter.data || []).length, 0);
    }
  }

  console.log("AU-R3 and AU-R4 descriptive-author access test passed.");
} finally {
  if (createdIds.length) await admin.from("applications").delete().in("id", createdIds);
  await felix.auth.signOut();
  await james.auth.signOut();
}
