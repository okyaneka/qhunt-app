import type { VueElement } from "vue";
import type { Type } from "~/_src/helpers";

export interface Bread {
  key: string;
  message: string | VueElement;
  type: Type;
  /**
   * duration in number of ms
   */
  duration: number;
}
