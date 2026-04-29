# VaultDesk CRUD Playbook

## 🧠 What This Is

A reusable pattern for building **auth-protected CRUD systems** using:

- Next.js (App Router)
- Supabase (Database + Auth)
- Row Level Security (RLS)

This pattern can be reused for:
Workspaces, Deals, Contacts, Contracts, Notes, etc.

---

## 🔐 1. Auth Protection (Server)

Every page starts with:

```ts
const supabase = await createClient();

const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  redirect("/login");
}
```

👉 Ensures only logged-in users can access data

---

## 🗄️ 2. Fetch User Data

```ts
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("user_id", user.id);
```

👉 Always filter by `user_id`

---

## ➕ 3. Create (Insert)

```ts
await supabase.from("table_name").insert({
  name,
  description,
  user_id: user.id,
});
```

Then redirect:

```ts
redirect("/route?success=created");
```

---

## ✏️ 4. Update

```ts
await supabase
  .from("table_name")
  .update({
    name,
    description,
    updated_at: new Date().toISOString(),
  })
  .eq("id", id)
  .eq("user_id", user.id);
```

Then redirect:

```ts
redirect(`/route/${id}?success=updated`);
```

---

## ❌ 5. Delete

### Client protection:

```ts
const confirmed = window.confirm("Are you sure?");
if (!confirmed) e.preventDefault();
```

### Server delete:

```ts
await supabase
  .from("table_name")
  .delete()
  .eq("id", id)
  .eq("user_id", user.id);
```

Then redirect:

```ts
redirect("/route?success=deleted");
```

---

## 💬 6. Success Messaging

### Page setup:

```ts
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
```

### UI messages:

```tsx
{success === "created" && <p>Created successfully</p>}
{success === "updated" && <p>Updated successfully</p>}
{success === "deleted" && <p>Deleted successfully</p>}
```

---

## 🔒 7. Security Rule (CRITICAL)

Every query MUST include:

```ts
.eq("user_id", user.id)
```

👉 Prevents users from accessing other users' data

---

## 🧱 8. Mental Model

This system is:

Auth → User → Data → Action → Redirect → Feedback

---

## 🚀 9. Reuse Pattern

To build a new system:

1. Create new table (e.g. deals)
2. Add `user_id` column
3. Copy this pattern
4. Replace:
   - table_name
   - fields (name, description, etc.)
   - routes

---

## 🏁 Outcome

You now have a **production-ready CRUD system pattern** that can be reused across any app.