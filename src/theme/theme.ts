import {
  slate,
  gray,
  zinc,
  neutral,
  stone,
  blue,
  indigo,
  red,
  orange,
  fuchsia,
  green,
  yellow,
} from "./primitive";

const base = {
  white: "#fff",
  black: "#171717",
  transparent: "rgba(0,0,0,0)",
} as const;

const brand = {
  primary: blue[500],
} as const;

const bg = {
  white: base.white,
  lightGray: neutral[50],
  gray: neutral[100],
  overlay: "rgba(0,0,0,0.6)",
  primary: blue[50],
} as const;

const border = {
  base: neutral[200],
  black: base.black,
  primary: blue[100],
} as const;

const status = {
  success: green[500],
  info: blue[500],
  warning: yellow[500],
  error: red[500],
} as const;

const txt = {
  base: base.black,
  sub1: neutral[500],
  sub2: neutral[600],
  disabled: neutral[400],
  white: base.white,
  primary: brand.primary,
  error: status.error,
} as const;

const icon = {
  base: base.black,
  white: base.white,
  sub1: neutral[500],
  sub2: neutral[600],
  disabled: neutral[400],
  primary: brand.primary,
  error: status.error,
} as const;

const button = {
  primary: brand.primary,
  primaryHover: blue[600],
  black: base.black,
  gray: bg.gray,
  grayHover: neutral[200],
  outline: border.base,
  error: status.error,
  warning: red[50],
} as const;

export const theme = {
  colors: {
    ...base,
    brand,
    bg,
    border,
    txt,
    icon,
    status,
    button,
    primitive: {
      slate,
      gray,
      zinc,
      neutral,
      stone,
      blue,
      indigo,
      red,
      orange,
      fuchsia,
      green,
      yellow,
    },
  },
} as const;
