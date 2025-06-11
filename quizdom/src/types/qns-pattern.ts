type QnType = "img" | "visualvideoans" | "visualaudio";
type QnMeta = { type: QnType };
type QnMetaMap = Record<string, QnMeta>;
type QnMetaRoot = Record<string, QnMetaMap>;

export const IntraJRMeta: QnMetaRoot = {
  oyo: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  mm: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "visualvideoans" },
  },
  oyf: {
    literature: { type: "img" },
    history: { type: "img" },
    music: { type: "visualaudio" },
    sports: { type: "img" },
    science: { type: "img" },
    mystery: { type: "visualvideoans" },
  },
};

export const IntraSRMeta: QnMetaRoot = {
  oyo: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  cc: {
    "1": { type: "img" },
    "2": { type: "img" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "visualvideoans" },
    answer: { type: "img" },
  },
  pnb: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  oyf: {
    literature: { type: "img" },
    history: { type: "img" },
    music: { type: "visualaudio" },
    sports: { type: "img" },
    science: { type: "img" },
    mystery: { type: "visualvideoans" },
  },
};

export const InterSchMeta: QnMetaRoot = {
  oyo: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  pnb: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  cc: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    answer: { type: "img" },
  },
  mm: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
  },
  pbk: {
    "1": { type: "visualvideoans" },
    "2": { type: "visualaudio" },
    "3": { type: "img" },
    "4": { type: "img" },
    "5": { type: "img" },
    "6": { type: "img" },
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
    science: { type: "img" },
    mystery: { type: "visualvideoans" },
  },
};
