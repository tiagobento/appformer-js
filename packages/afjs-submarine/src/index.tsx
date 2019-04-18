import * as React from "react";
import { AppFormerSubmarine } from "./AppFormerSubmarine";

declare global {
  export interface AppFormer {
    Submarine: AppFormerSubmarine;
  }
}

export * from "./AppFormerSubmarine";
export * from "./app/App";
