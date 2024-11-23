import { useState } from "react";
import "./App.css";
import { inflate } from "pako";

export const initialExample =
  "0eNqV0tEKgyAUBuB3OdcGy8wtX2WMUe0QB8xCbWyE7z7bYDeTmJeK/ye/nhU6veBsyXhQK1A/GQfqvIKjwbR62zPtiKBAtw5t4Rdr0UNgQOaGD1BluDBA48kTfpLvxfNqlrFDGw+wpMBgnlwMTWa7I0JFKSSDJyjJeQjsx+H/O2LPqf53+J4j8nuJlFN/nY6GAjX23lJfzJPG3XJJTOaXSzrH/HIy5ZzyPy3pNPm9ohMnkzyO29N+h5zBHa17J2rJG9E0tThW/FDVIbwAKnX+1A==";

export const decodeBlueprint = (blueprintString: string): string => {
  let decodedString = "Unable to parse blueprint";
  try {
    // Slice removes the version string at beginning of BP
    const b64Decoded = window.atob(blueprintString.slice(1));
    const decompressed = inflate(Uint8Array.from(b64Decoded, (c) => c.charCodeAt(0)));
    const decoded = new TextDecoder("utf-8").decode(decompressed);
    // pretty print json
    decodedString = JSON.stringify(JSON.parse(decoded), undefined, 2);
  } catch (error) {
    console.error(error);
  }
  return decodedString;
};

function App() {
  const [state, setState] = useState({
    blueprintString: initialExample,
    decodedString: decodeBlueprint(initialExample),
  });

  const onInputUpdated = (blueprintString: string): void =>
    setState({
      blueprintString,
      decodedString: decodeBlueprint(blueprintString),
    });

  return (
    <div className="App">
      <header className="App-header">
        Input blueprint string
        <br />
        <input
          value={state.blueprintString}
          onInput={(e) => onInputUpdated((e.target as HTMLInputElement).value)}
          onFocus={(e) => e.target.select()}
        />
      </header>
      <pre id="blueprint-contents">{state.decodedString.toString()}</pre>
    </div>
  );
}

export default App;
