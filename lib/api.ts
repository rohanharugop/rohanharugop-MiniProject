export const BASE_URL = "http://localhost:8000";

export async function signup(stream: string, goal: string, specialization: string) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stream, goal, specialization }),
  });
  return res.json();
}

export async function fetchChecklist(userId: string) {
  const res = await fetch(`${BASE_URL}/checklist/${userId}`);
  return res.json();
}

export async function updateChecklistItem(userId: string, itemId: string, completed: boolean) {
  await fetch(`${BASE_URL}/checklist/${userId}/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}
