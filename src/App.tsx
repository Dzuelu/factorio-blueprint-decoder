import { useState } from "react";
import "./App.css";
import { deflate, inflate } from "pako";
import { bytesToBase64 } from "./base64";

export const initialExample =
  "0eNqV0tEKgyAUBuB3OdcGy8wtX2WMUe0QB8xCbWyE7z7bYDeTmJeK/ye/nhU6veBsyXhQK1A/GQfqvIKjwbR62zPtiKBAtw5t4Rdr0UNgQOaGD1BluDBA48kTfpLvxfNqlrFDGw+wpMBgnlwMTWa7I0JFKSSDJyjJeQjsx+H/O2LPqf53+J4j8nuJlFN/nY6GAjX23lJfzJPG3XJJTOaXSzrH/HIy5ZzyPy3pNPm9ohMnkzyO29N+h5zBHa17J2rJG9E0tThW/FDVIbwAKnX+1A==";

const VERSION_BIT = "0";

export const decodeBlueprint = (blueprintString: string): string => {
  let decodedString = "Unable to parse blueprint";
  try {
    // Slice removes the version string at beginning of BP
    const b64Decoded = window.atob(blueprintString.slice(1));
    const decompressed = inflate(
      Uint8Array.from(b64Decoded, (c) => c.charCodeAt(0))
    );
    const decoded = new TextDecoder("utf8").decode(decompressed);
    // pretty print json
    decodedString = JSON.stringify(JSON.parse(decoded), undefined, 2);
  } catch (error) {
    console.error("decodeBlueprint", { error });
  }
  return decodedString;
};

export const encodeBlueprint = (blueprintString: string): string => {
  let encodedString = "Unable to encode blueprint";
  try {
    const compressed = deflate(blueprintString, { level: 9 });
    const b64Encoded = bytesToBase64(compressed);
    return `${VERSION_BIT}${b64Encoded}`;
  } catch (error) {
    console.error("encodeBlueprint", { error });
  }
  return encodedString;
};

function App() {
  const [state, setState] = useState({
    blueprintString: initialExample,
    decodedString: decodeBlueprint(initialExample),
  });

  const onDecodeInputUpdated = (str: string): void =>
    setState({
      blueprintString: str,
      decodedString: decodeBlueprint(str),
    });

  const onEncodeInputUpdated = (str: string): void =>
    setState({
      blueprintString: encodeBlueprint(str),
      decodedString: str,
    });

  return (
    <div className="App">
      <header className="App-header">
        Input blueprint string
        <br />
        <input
          value={state.blueprintString}
          onInput={(e) =>
            onDecodeInputUpdated((e.target as HTMLInputElement).value)
          }
          onFocus={(e) => e.target.select()}
        />
      </header>
      <textarea
        id="blueprint-contents"
        value={state.decodedString.toString()}
        onInput={(e) =>
          onEncodeInputUpdated((e.target as HTMLInputElement).value)
        }
      ></textarea>
    </div>
  );
}

export default App;
