import { useEffect, useState } from "react";
import { fetchChecklist, updateChecklistItem } from "@/lib/api";

export default function Checklist({ userId }: { userId: string }) {
  const [data, setData] = useState<{ title: string, items: any[] } | null>(null);

  useEffect(() => {
    fetchChecklist(userId).then(setData);
  }, [userId]);

  const toggleItem = async (id: string, current: boolean) => {
    await updateChecklistItem(userId, id, !current);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item => item.id === id ? { ...item, completed: !current } : item)
      };
    });
  };

  if (!data) return <p>Loading checklist...</p>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold">{data.title}</h2>
      {data.items.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <input type="checkbox" checked={item.completed} onChange={() => toggleItem(item.id, item.completed)} />
          <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
