/**
 * Livestream — matches `/api/v1/livestream/*`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import { LiveSettings, PreviousStream } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export type LiveWithStreams = LiveSettings & {
  previousStreams?: PreviousStream[];
};

export const livestreamApi = {
  /** Current live settings + recent streams (cached on server) */
  getActive: async (): Promise<LiveWithStreams | null> => {
    try {
      const res =
        await apiClient.get<ApiResponse<LiveWithStreams | null>>(
          "/livestream/active",
        );
      const body = unwrap(res);
      return body ?? null;
    } catch {
      return null;
    }
  },

  /** Scheduled / past streams list */
  getSchedule: async (): Promise<PreviousStream[]> => {
    try {
      const res = await apiClient.get<ApiResponse<PreviousStream[]>>(
        "/livestream/schedule",
      );
      const body = unwrap(res);
      return body ?? [];
    } catch {
      return [];
    }
  },

  create: async (payload: Partial<LiveSettings>): Promise<LiveSettings> => {
    const res = await apiClient.post<ApiResponse<LiveSettings>>(
      "/livestream",
      payload,
    );
    return unwrap(res);
  },

  goLive: async (): Promise<LiveSettings> => {
    const res = await apiClient.put<ApiResponse<LiveSettings>>(
      "/livestream?action=go-live",
    );
    return unwrap(res);
  },

  end: async (): Promise<LiveSettings> => {
    const res =
      await apiClient.put<ApiResponse<LiveSettings>>("/livestream?action=end");
    return unwrap(res);
  },
};
