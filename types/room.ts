export type SanitizedRoom = {
  position: [number, number, number];
  scale: [number, number];
  widgets?: {
    aiConversations: number[];
    recipes: number[];
    task: number[];
    stickyNotes: number[];
  };
  name: string;
  anchorId: string;
  rotation: number;
};

type PrismaRoom = {
  name: string;
  anchorId: string;
  id: number;
  userId: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotation: number;
  scaleX: number;
  scaleZ: number;
};

export const sanitizeRoom = (unsanitized: PrismaRoom): SanitizedRoom => {
  return {
    name: unsanitized.name,
    scale: [unsanitized.scaleX, unsanitized.scaleZ],
    position: [unsanitized.positionX, unsanitized.positionY, unsanitized.positionZ],
    anchorId: unsanitized.anchorId,
    rotation: unsanitized.rotation,
  };
};
