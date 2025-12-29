type QnType = "img" | "visualvideoans" | "visualaudio";
type QnMeta = { type: QnType };
type QnMetaMap = Record<string, QnMeta>;
type QnMetaRoot = Record<string, QnMetaMap>;

export const InterSchMeta: QnMetaRoot = {
  oyo: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
    "7": { type: "img" },
    "8": { type: "img" },
  },
  pnb: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "visualvideoans" },
    "5": { type: "img" },
    "6": { type: "img" },
    "7": { type: "img" },
    "8": { type: "img" },
  },
  cc: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    answer: { type: "img" },
  },
  mm: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
  },
  pbk: {
    "1": { type: "visualaudio" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "visualaudio" },
    "7": { type: "img" },
    "8": { type: "img" },
    "9": { type: "img" },
    "10": { type: "img" },
  },
  oyf: {
    literature: { type: "img" },
    history: { type: "img" },
    music: { type: "visualaudio" },
    sports: { type: "img" },
    world: { type: "img" },
    mythology: { type: "img" },
    defence: { type: "img" },
    mystery: { type: "img" },
  },
  tiebreaker: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
  },
};

export const AudienceMeta: QnMetaMap = {
  "1": { type: "img" },
  "2": { type: "img" },
  "3": { type: "img" },
  "4": { type: "visualvideoans" },
  "5": { type: "img" },
  "6": { type: "img" },
  "7": { type: "img" },
  "8": { type: "img" },
};
