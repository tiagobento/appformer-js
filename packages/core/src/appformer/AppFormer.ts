import { Screen } from "./Screen";
import { Perspective } from "./Perspective";

export interface AppFormer {
  /**
   * Registers a Screen component.
   * @param screen
   */
  // tslint:disable-next-line
  registerScreen(screen: Screen): void;

  /**
   * Registers a Perspective component
   * @param perspective
   */
  // tslint:disable-next-line
  registerPerspective(perspective: Perspective): void;

  /**
   * Renders the component with the corresponding id.
   * @param af_componentId
   * The component id
   * @param args
   * Arbitrary arguments to be used by the component
   */
  // tslint:disable-next-line
  goTo(af_componentId: string, args?: Map<string, any>): void;
}
