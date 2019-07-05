import * as AppFormer from "appformer-js-core";
import * as React from "react";

export class DummyEditor extends AppFormer.Editor {
    constructor() {
        super("dummy-editor");
        this.af_componentTitle = "Dummy Editor";
        this.af_isReact = true;
    }

    public af_componentRoot(): AppFormer.Element {
        return <div>This is a dummy editor!</div>;
    }

    public getContent(): Promise<string> {
        return Promise.resolve("");
    }

    public isDirty(): boolean {
        return false;
    }

    public setContent(content: string): Promise<void> {
        return Promise.resolve();
    }
}