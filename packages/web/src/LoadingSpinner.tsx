import * as React from "react";

export function LoadingSpinner(props: { showing: boolean }) {
  return (
    <>
      {props.showing && (
        <span>
          <img style={{ width: "20px", margin: "0 0 -2px 7px", filter: "invert(100%)" }} src={"/spinner.gif"} />
        </span>
      )}
    </>
  );
}
