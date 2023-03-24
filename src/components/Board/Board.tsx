import React from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/shades-of-purple.css";

import { type Field } from "~/types/schema.types";

const Board = ({ jsonLD, indent = 4 }: { jsonLD: Field; indent?: number }) => {
  return <Highlight>{JSON.stringify(jsonLD, null, indent)}</Highlight>;
};

export default Board;
