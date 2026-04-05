export interface PreviousStream {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  date: string; // ISO
}

export interface LiveSettings {
  isLive: boolean;
  streamUrl: string;
  title: string;
  description: string;
  previousStreams?: PreviousStream[];
}

export const defaultLiveSettings: LiveSettings = {
  isLive: false,
  streamUrl: "",
  title: "Sunday Service",
  description: "Join us live for worship and the Word.",
};
