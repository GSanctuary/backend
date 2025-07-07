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

  return {
    name: unsanitized.name,
    scale: [unsanitized.scaleX, unsanitized.scaleY],
    positions: unsanitized.positions
      .map((_, i) =>
        i % 3 == 0
          ? ([
              unsanitized.positions[i],
              unsanitized.positions[i + 1],
              unsanitized.positions[i + 2],
            ] as [number, number, number])
          : undefined,
      )
      .filter((v) => !!v),
  };
};
