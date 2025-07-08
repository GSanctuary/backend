export type SanitizedRoom = {
  positions: [number, number, number][];
  scale: [number, number];
  widgets?: {
    aiConversations: number[];
    recipes: number[];
    task: number[];
    stickyNotes: number[];
  };
  name: string;
};

type PrismaRoom = {
  name: string;
  id: number;
  userId: number;
  positions: number[];
  scaleX: number;
  scaleY: number;
};

export const sanitizeRoom = (unsanitized: PrismaRoom): SanitizedRoom => {
  if (unsanitized.positions.length % 3 != 0) {
    throw Error(`Unsanitized room has invalid positions array`);
  }

  const positions: [number, number, number][] = [];

  for (let i = 0; i < unsanitized.positions.length; i += 3) {
    positions.push([
      unsanitized.positions[i],
      unsanitized.positions[i + 1],
      unsanitized.positions[i + 2],
    ]);
  }

  return {
    name: unsanitized.name,
    scale: [unsanitized.scaleX, unsanitized.scaleY],
    positions,
  };
};
