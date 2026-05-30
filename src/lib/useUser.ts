import { useEffect, useState, useCallback } from "react";

export type Choice = "agree" | "neutral" | "disagree";

const VOTES_KEY = "ss-votes";
const COMMENTS_KEY = "ss-comments";
const NAME_KEY = "ss-username";
const JOINED_KEY = "ss-joined";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export interface LocalComment {
  id: string;
  statementId: string;
  text: string;
  at: string;
}

export function useUser() {
  const [votes, setVotes] = useState<Record<string, Choice>>({});
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [username, setUsername] = useState<string>("Burger");
  const [joined, setJoined] = useState<string>("");

  useEffect(() => {
    setVotes(read<Record<string, Choice>>(VOTES_KEY, {}));
    setComments(read<LocalComment[]>(COMMENTS_KEY, []));
    setUsername(read<string>(NAME_KEY, "Burger Suriname"));
    let j = read<string>(JOINED_KEY, "");
    if (!j) {
      j = new Date().toISOString();
      write(JOINED_KEY, j);
    }
    setJoined(j);

    const onStorage = () => {
      setVotes(read<Record<string, Choice>>(VOTES_KEY, {}));
      setComments(read<LocalComment[]>(COMMENTS_KEY, []));
      setUsername(read<string>(NAME_KEY, "Burger Suriname"));
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("ss-user-update", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ss-user-update", onStorage);
    };
  }, []);

  const recordVote = useCallback((statementId: string, choice: Choice) => {
    const next = { ...read<Record<string, Choice>>(VOTES_KEY, {}), [statementId]: choice };
    write(VOTES_KEY, next);
    setVotes(next);
    window.dispatchEvent(new Event("ss-user-update"));
  }, []);

  const addComment = useCallback((statementId: string, text: string) => {
    const c: LocalComment = {
      id: crypto.randomUUID(),
      statementId,
      text,
      at: new Date().toISOString(),
    };
    const next = [c, ...read<LocalComment[]>(COMMENTS_KEY, [])];
    write(COMMENTS_KEY, next);
    setComments(next);
    window.dispatchEvent(new Event("ss-user-update"));
    return c;
  }, []);

  const updateName = useCallback((name: string) => {
    write(NAME_KEY, name);
    setUsername(name);
    window.dispatchEvent(new Event("ss-user-update"));
  }, []);

  return { votes, comments, username, joined, recordVote, addComment, updateName };
}
