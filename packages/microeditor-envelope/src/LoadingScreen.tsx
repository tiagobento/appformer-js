import * as React from "react";
import { useState } from "react";

export function LoadingScreen(props: { visible: boolean }) {
  const fadeOutDelay = 400;
  let cssAnimation;
  const [mustRender, setMustRender] = useState(true);

  if (props.visible) {
    cssAnimation = { opacity: 1 };
  } else {
    cssAnimation = { opacity: 0, transition: `opacity ${fadeOutDelay}ms` };
    setTimeout(() => setMustRender(false), fadeOutDelay);
  }

  return (
    <>
      {mustRender && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            textAlign: "center",
            backgroundColor: "#1e1e1e",
            padding: "40px 0 0 0",
            ...cssAnimation
          }}
        >
          <span style={{ fontFamily: "Helvetica", color: "white", fontSize: "12pt" }}>Loading...</span>
        </div>
      )}
    </>
  );
}
