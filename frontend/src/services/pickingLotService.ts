import type { CreatePickingLotRequest, CreatePickingLotResponse } from '../types/PickingLot';
import { API_BASE_URL } from '../config/appConfig';

/**
 * PickingLotService - API client for the Picking Lot backend.
 * Communicates with the Google Apps Script Web App deployment.
 */
class PickingLotService {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = `${API_BASE_URL}`;
  }

  /**
   * Create a new Picking Lot.
   * The backend generates LotID, Status, CreatedDateTime, and CreatedBy.
   *
   * @param data The request payload.
   * @returns The success response containing the generated LotID.
   */
  async createPickingLot(data: CreatePickingLotRequest): Promise<CreatePickingLotResponse> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as CreatePickingLotResponse;
  }
}

/** Singleton instance for application-wide use. */
export const pickingLotService = new PickingLotService();