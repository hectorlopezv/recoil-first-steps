import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Canvas from "./Canvas";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Atoms } from "./examples/Atoms";
import { Selectors } from "./examples/Selectors";
import { Async } from "./examples/Async";
import { AtomEffects } from "./examples/AtomsEffects";
import { AtomEffectsFamily } from "./examples/AtomEffectsFamily";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Canvas />} />
            <Route path="/examples/atoms" element={<Atoms />} />
            <Route path="/examples/selectors" element={<Selectors />} />
            <Route path="/examples/async" element={<Async />} />
            <Route path="/examples/atomEffects" element={<AtomEffects />} />
            <Route
              path="/examples/AtomEffectsFamily"
              element={<AtomEffectsFamily />}
            />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
