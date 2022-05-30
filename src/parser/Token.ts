import type Comment from "./Comment";
import type Struct from "./Struct";
import type StructField from "./StructField";

type Token = Struct | StructField | Comment;

export default Token;
