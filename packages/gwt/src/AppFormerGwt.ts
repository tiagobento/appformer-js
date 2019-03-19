import { Portable } from "./marshalling";
import { AppFormer } from "appformer-js-core";
import { Element } from "appformer-js-core";

export interface AppFormerGwt extends AppFormer {
  /**
   * Translates a bundle key
   * @param tkey
   * The bundle key
   * @param args
   * The arguments to this bundle
   */
  // tslint:disable-next-line
  translate(tkey: string, args: string[]): string;

  /**
   * Renders a component.
   * @param element
   * The component to be rendered
   * @param container
   * The DOM element on which the component will be rendered.
   * @param callback
   * Function to be executed after the component is done rendering.
   */
  // tslint:disable-next-line
  render(element: Element, container: HTMLElement, callback: () => void): void;

  /**
   * Fires an event using Errai bus.
   * @param obj
   * The event object.
   */
  // tslint:disable-next-line
  fireEvent<T>(obj: Portable<T>): void;

  /**
   * Executes an RPC call to an Errai Remote.
   * @param path
   * The Errai bus RPC path
   * @param args
   * The arguments to this RPC
   */
  rpc(path: string, args: Array<Portable<any>>): Promise<string>;

  /**
   * Unrenders a component
   * @param af_componentId
   * The component id.
   */
  // tslint:disable-next-line
  close(af_componentId: string): void;
}
