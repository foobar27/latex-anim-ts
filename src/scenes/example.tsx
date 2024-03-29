import {
  makeScene2D,
  Circle,
  Rect,
  Layout,
  Path,
  Node,
  NodeProps,
  initial,
  signal,
  colorSignal,
  vector2Signal,
  CanvasStyle,
  PossibleCanvasStyle,
  CanvasStyleSignal,
} from '@motion-canvas/2d';
import {
  all,
  createRef,
  waitFor,
  range,
  makeRef,
  tween,
  createSignal,
  SignalValue,
  Signal,
  Color,
  PossibleColor,
  PossibleVector2,
  Vector2Signal,
  SimpleSignal,
  ColorSignal,
  easeInOutCubic,
  Matrix2D,
} from '@motion-canvas/core';


export interface GlyphProps extends NodeProps {
  color: SignalValue<PossibleColor>;
  data: SignalValue<string>;
  position: SignalValue<PossibleVector2>
}

function setAlpha(color: Color, alpha: number) {
  // TODO why does color.alpha(0.0) not work?
  return new Color({ r: color.rgb()[0], g: color.rgb()[1], b: color.rgb()[2], a: alpha });
}

export class Glyph extends Path {
  @colorSignal()
  public declare readonly color: ColorSignal<this>;

  @signal()
  public declare readonly data: SimpleSignal<string, this>;

  // @vector2Signal()
  // public declare readonly position: Vector2Signal<this>;

  // private readonly path = createRef<Path>();

  public constructor(props?: GlyphProps) {
    super({
      ...props,
    });
    this.add(
      <Path
        //ref={this.path}
        start={0.0}
        end={1.0}
        stroke={this.color}
        data={props.data}
        position={props.position}
        lineWidth={1} // TODO why so small?
        fill={() => setAlpha(this.color(), 0.0)}
      />
    );
  }

  public * fadeIn(duration: number) {
    yield* tween(2 / 3 * duration, value => {
      //this.end(easeInOutCubic(value));
    });
    yield* tween(1 / 3 * duration, value => {
      this.fill(setAlpha(this.color(), easeInOutCubic(value, value)));
    });
  }

}

export default makeScene2D(function* (view) {
  view.fill("black");
  const glyphT = "M 5.71875 -6.875 L 5.65625 -6.9375 C 4.78125 -6.890625 3.78125 -6.84375 3.046875 -6.84375 C 1.28125 -6.84375 1.28125 -6.921875 0.328125 -6.953125 L 0.265625 -6.875 L 0.265625 -6.40625 L 0.34375 -6.328125 C 1.453125 -6.375 2.234375 -6.40625 2.46875 -6.40625 C 2.515625 -6.40625 2.5625 -6.375 2.5625 -6.34375 C 2.578125 -6.046875 2.578125 -4.609375 2.578125 -3.78125 C 2.578125 -2.515625 2.53125 -1.25 2.453125 0.015625 L 2.546875 0.09375 L 3.53125 -0.171875 C 3.46875 -1.375 3.40625 -3.15625 3.40625 -4.359375 C 3.40625 -5.578125 3.40625 -6.421875 3.53125 -6.421875 C 3.75 -6.421875 3.953125 -6.40625 5.625 -6.3125 L 5.71875 -6.390625 Z M 5.71875 -6.875";
  const glyphPrime = "M 2.015625 -3.296875 C 2.078125 -3.40625 2.078125 -3.46875 2.078125 -3.515625 C 2.078125 -3.734375 1.890625 -3.890625 1.671875 -3.890625 C 1.40625 -3.890625 1.328125 -3.671875 1.296875 -3.5625 L 0.375 -0.546875 C 0.359375 -0.53125 0.328125 -0.453125 0.328125 -0.4375 C 0.328125 -0.359375 0.546875 -0.28125 0.609375 -0.28125 C 0.65625 -0.28125 0.65625 -0.296875 0.703125 -0.40625 Z M 2.015625 -3.296875";
  const glyphF = "M 0.59375 -3.03125 L 0.53125 -2.984375 L 0.5 -2.828125 L 0.53125 -2.78125 L 1.421875 -2.78125 L 1.46875 -2.71875 L 1.46875 -1.96875 C 1.46875 -1.34375 1.421875 -0.6875 1.359375 0 L 1.5 0.078125 L 2.125 -0.078125 C 2.0625 -0.640625 2.046875 -1.3125 2.046875 -1.96875 L 2.046875 -2.734375 L 2.09375 -2.78125 L 3 -2.78125 L 3.046875 -2.828125 L 3.109375 -2.96875 L 3.0625 -3.03125 L 2.09375 -3.03125 L 2.0625 -3.0625 C 2.0625 -3.78125 2.1875 -4.390625 2.53125 -4.390625 C 2.90625 -4.390625 2.96875 -4.078125 2.984375 -3.9375 L 3.09375 -3.90625 L 3.53125 -4.28125 C 3.4375 -4.46875 3.234375 -4.65625 2.8125 -4.65625 C 2.3125 -4.65625 1.84375 -4.390625 1.609375 -3.921875 C 1.484375 -3.671875 1.46875 -3.3125 1.453125 -3.0625 L 1.421875 -3.03125 Z M 0.59375 -3.03125";
  const glyph2p2 = "M 3.359375 -0.359375 L 3.421875 -0.3125 C 3.40625 0.59375 3.03125 1.34375 2.203125 1.34375 C 1.921875 1.34375 1.5625 1.046875 1.421875 0.796875 L 1.3125 0.796875 L 0.921875 1.234375 C 1.3125 1.546875 1.671875 1.625 2.015625 1.625 C 2.484375 1.625 2.890625 1.515625 3.296875 1.25 C 3.453125 1.140625 3.75 0.90625 3.875 0.59375 C 4.03125 0.1875 4.03125 -0.3125 4.03125 -0.578125 C 4.03125 -2.03125 4.0625 -2.53125 4.109375 -3.15625 L 4 -3.203125 L 3.59375 -3 C 3.328125 -3.171875 3 -3.234375 2.671875 -3.234375 C 1.640625 -3.234375 0.875 -2.5 0.875 -1.28125 C 0.875 -0.46875 1.359375 0.078125 2.015625 0.078125 C 2.5 0.078125 2.9375 -0.15625 3.359375 -0.359375 Z M 3.421875 -0.6875 C 3.25 -0.5625 2.8125 -0.359375 2.453125 -0.359375 C 2.046875 -0.359375 1.546875 -0.796875 1.546875 -1.421875 C 1.546875 -1.859375 1.609375 -2.375 2.015625 -2.71875 C 2.203125 -2.890625 2.453125 -3 2.71875 -3 C 3.078125 -3 3.375 -2.859375 3.421875 -2.53125 Z M 3.421875 -0.6875";
  const glyphPrime2 = "M 1.796875 -2.3125 C 1.796875 -2.328125 1.84375 -2.421875 1.84375 -2.5 C 1.84375 -2.671875 1.6875 -2.78125 1.53125 -2.78125 C 1.328125 -2.78125 1.28125 -2.625 1.25 -2.5625 L 0.484375 -0.40625 C 0.46875 -0.34375 0.46875 -0.328125 0.46875 -0.3125 C 0.46875 -0.234375 0.671875 -0.1875 0.671875 -0.1875 C 0.71875 -0.1875 0.734375 -0.21875 0.765625 -0.28125 Z M 1.796875 -2.3125";
  const glyph4p1 = "M 0.390625 -3.15625 L 0.390625 -2.6875 C 0.453125 -2.6875 0.546875 -2.703125 0.625 -2.703125 C 0.78125 -2.703125 0.9375 -2.671875 0.9375 -2.53125 L 0.9375 -0.484375 L 0.359375 -0.484375 L 0.359375 0 L 1.984375 0 L 1.984375 -0.484375 L 1.46875 -0.484375 L 1.46875 -3.234375 Z M 1.03125 -4.84375 C 0.84375 -4.8125 0.6875 -4.640625 0.6875 -4.453125 C 0.6875 -4.265625 0.84375 -4.046875 1.078125 -4.046875 C 1.296875 -4.046875 1.484375 -4.21875 1.484375 -4.453125 C 1.484375 -4.640625 1.328125 -4.84375 1.09375 -4.84375 C 1.078125 -4.84375 1.046875 -4.84375 1.03125 -4.84375 Z M 1.03125 -4.84375";
  const glyph4p2 = "M 2.453125 -4.765625 L 2.453125 -4.296875 C 2.53125 -4.296875 2.625 -4.296875 2.703125 -4.296875 C 2.875 -4.296875 3.03125 -4.265625 3.03125 -4.109375 L 3.03125 -2.859375 C 2.6875 -3.125 2.140625 -3.234375 1.75 -3.234375 C 0.734375 -3.234375 0.328125 -2.390625 0.328125 -1.609375 C 0.328125 -1.15625 0.453125 -0.6875 0.765625 -0.34375 C 1.015625 -0.078125 1.375 0.03125 1.734375 0.03125 C 2.171875 0.03125 2.671875 -0.125 3 -0.4375 L 3 0.03125 L 4.125 0.03125 L 4.125 -0.484375 L 3.8125 -0.484375 C 3.6875 -0.484375 3.546875 -0.5 3.546875 -0.625 L 3.546875 -4.84375 Z M 0.9375 -1.484375 L 0.9375 -1.5625 C 0.9375 -2.125 1.15625 -2.765625 2.03125 -2.765625 C 2.375 -2.765625 2.78125 -2.625 2.953125 -2.3125 C 2.96875 -2.28125 2.984375 -2.25 3 -2.203125 L 3 -1.25 C 3 -0.921875 2.625 -0.609375 2.359375 -0.515625 C 2.234375 -0.453125 2.09375 -0.4375 1.953125 -0.4375 C 1.65625 -0.4375 1.359375 -0.546875 1.171875 -0.765625 C 1 -0.96875 0.96875 -1.21875 0.9375 -1.484375 Z M 0.9375 -1.484375";
  const glyph5p1 = "M 3.90625 -3.4375 L 3.875 -3.46875 C 3.34375 -3.453125 2.75 -3.421875 2.3125 -3.421875 C 1.25 -3.421875 1.25 -3.453125 0.6875 -3.46875 L 0.640625 -3.4375 L 0.640625 -3.203125 L 0.6875 -3.171875 C 1.34375 -3.1875 1.828125 -3.203125 1.96875 -3.203125 C 2 -3.203125 2.015625 -3.1875 2.015625 -3.171875 C 2.03125 -3.015625 2.03125 -2.296875 2.03125 -1.890625 C 2.03125 -1.265625 2 -0.625 1.953125 0 L 2.015625 0.046875 L 2.609375 -0.078125 C 2.5625 -0.6875 2.53125 -1.578125 2.53125 -2.1875 C 2.53125 -2.578125 2.546875 -3.078125 2.546875 -3.15625 C 2.546875 -3.1875 2.5625 -3.203125 2.609375 -3.203125 C 2.734375 -3.203125 2.859375 -3.203125 3.859375 -3.15625 L 3.90625 -3.1875 Z M 3.90625 -3.4375";

  const terminal1 = createRef<Glyph>();
  const terminal2 = createRef<Glyph>();
  const terminal3 = createRef<Glyph>();
  const path4 = createRef<Path>();
  const path5 = createRef<Path>();
  const terminal6 = createRef<Glyph>();
  const path7 = createRef<Path>();
  const path8 = createRef<Path>();
  const terminal9 = createRef<Glyph>();
  const terminal10 = createRef<Glyph>();
  const path11 = createRef<Path>();
  const path12 = createRef<Path>();
  const terminal13a = createRef<Glyph>();
  const terminal13b = createRef<Glyph>();
  const terminal14 = createRef<Glyph>();
  const path15 = createRef<Path>();
  const path16 = createRef<Path>();
  const path17 = createRef<Path>();
  const path18 = createRef<Path>();

  const matrix4 = new Matrix2D(1, 0, 0, - 1, 105.093, 95.844);
  const matrix5 = new Matrix2D(0.87663, 0.48108, 0.48108, -0.87663, 126.84604, 73.48473);
  const matrix7 = new Matrix2D(1, 0, 0, -1, 105.093, 95.844);
  const matrix8 = new Matrix2D(0.0094, 0.99991, 0.99991, -0.0094, 136.57683, 69.88415);
  const matrix11 = new Matrix2D(1, 0, 0, -1, 105.093, 95.844);
  const matrix12 = new Matrix2D(0.70706, 0.70712, 0.70712, -0.70706, 63.90844, 71.18723);
  const matrix15 = new Matrix2D(1, 0, 0, -1, 105.093, 95.844);
  const matrix16 = new Matrix2D(-0.50002, 0.866, 0.866, 0.50002, 76.77458, 70.52056);
  const matrix17 = new Matrix2D(1, 0, 0, -1, 105.093, 95.844);
  const matrix18 = new Matrix2D(-0.85493, -0.51865, -0.51865, 0.85493, 79.7682, 83.68824);

  // TODO create component for arrow

  view.add(
    <Rect
      scale={20}
      position={[-900, -1000]} // TODO automatically compute to fill screen
    >
      <Glyph
        ref={terminal1}
        color={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={glyphT}
        position={[68.815, 81.658]}
      />
      <Glyph
        ref={terminal2}
        color={"rgb(56.001282%,82.843018%,35.496521%)"}
        data={glyphT}
        position={[131.786, 81.658]}
      />
      <Glyph
        ref={terminal3}
        color={"rgb(56.001282%,82.843018%, 35.496521%)"}
        data={glyphPrime}
        position={[138.578, 78.042]}
      />
      <Path
        ref={path4}
        stroke="rgb(56.001282%,82.843018%,35.496521%)" //
        data="M -25.495344 21.234625 C -9.62425 30.863531 5.653094 31.195563 21.578875 22.453375"
        // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
        // The values represent the following functions: matrix(scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY())
        scale={matrix4.scaling}
        position={matrix4.translation}
        rotation={matrix4.rotation}
        skew={[matrix4.skewX, matrix4.skewY]}
        lineWidth={0.3985}
        lineCap={"butt"}
        lineJoin={"miter"}
        lineDash={[2.78952, 1.59401]}
      // TODO miterlimit:10
      />
      <Path
        ref={path5}
        data={"M -2.072826 2.392012 C -1.694403 0.955427 -0.850274 0.277938 0.00124617 0.00108884 C -0.851651 -0.279815 -1.692937 -0.955386 -2.073359 -2.389552 "}
        stroke={"rgb(56.001282%,82.843018%,35.496521%)"}
        lineCap={"round"}
        lineJoin={"round"}
        lineWidth={0.3985}
        scale={matrix5.scaling}
        position={matrix5.translation}
        rotation={matrix5.rotation}
        skew={[matrix5.skewX, matrix5.skewY]}
      // TODO miterlimit:10
      />
      <Glyph
        ref={terminal6}
        color={"rgb(56.001282%,82.843018%,35.496521%)"}
        data={glyphF}
        position={[101.289, 64.653]}
      />
      <Path
        ref={path7}
        lineWidth={0.3985}
        scale={matrix7.scaling}
        position={matrix7.translation}
        rotation={matrix7.rotation}
        skew={[matrix7.skewX, matrix7.skewY]}
        lineCap={"butt"}
        lineJoin={"miter"}
        stroke={"rgb(100%,100%,100%)"}
        data={"M -33.268781 25.152594 C -33.628156 63.176031 31.129656 63.785406 31.481219 26.160406"}
      // TODO miterlimit:10
      />
      <Path
        ref={path8}
        //" d=" " transform="matrix(0.0094,0.99991,0.99991,-0.0094,136.57683,69.88415)" />
        lineWidth={0.3985}
        // TODO re-enable scaling (-0.01, -0.01)
        //scale={matrix8.scaling}
        position={matrix8.translation}
        rotation={matrix8.rotation}
        skew={[matrix8.skewX, matrix8.skewY]}
        lineCap={"round"}
        lineJoin={"round"}
        stroke={"rgb(100%,100%,100%)"}
        data={"M -2.072788 2.392088 C -1.691734 0.954783 -0.850355 0.278845 -0.00132533 0.00130758 C -0.8517 -0.279787 -1.694066 -0.955523 -2.070861 -2.38961 "}
      // TODO miterlimit:10
      />

      <Glyph
        ref={terminal9}
        color={"rgb(100%,100%,100%)"}
        data={glyphF}
        position={[100.44, 39.389]}
      />
      <Glyph
        ref={terminal10}
        color={"rgb(100%,100%,100%)"}
        data={glyphPrime2}
        position={[104.731, 36.858]}
      />
      <Path
        ref={path11}
        //     stroke-linecap:butt;stroke-linejoin:miter;stroke:;stroke-opacity:1;stroke-dasharray:;stroke-miterlimit:10;" d= />
        //" d=" " transform="matrix(0.0094,0.99991,0.99991,-0.0094,136.57683,69.88415)" />
        lineWidth={0.3985}
        scale={matrix11.scaling}
        position={matrix11.translation}
        rotation={matrix11.rotation}
        skew={[matrix11.skewX, matrix11.skewY]}
        lineCap={"butt"}
        lineJoin={"miter"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        lineDash={[2.78952, 1.59401]}
        data={"M -39.909406 10.105719 C -103.760969 -53.745844 -104.893781 88.371344 -41.323469 24.797125 "}
      // TODO miterlimit:10
      />
      <Path
        ref={path12}
        lineWidth={0.3985}
        scale={matrix12.scaling}
        position={matrix12.translation}
        rotation={matrix12.rotation}
        skew={[matrix12.skewX, matrix12.skewY]}
        lineCap={"round"}
        lineJoin={"round"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={"M -2.07311 2.390239 C -1.694628 0.956672 -0.849365 0.277207 0.00140448 0.00102274 C -0.849342 -0.280758 -1.694547 -0.954771 -2.070145 -2.391132 "}
      // TODO miterlimit:10
      />
      <Glyph
        ref={terminal13a}
        color={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={glyph4p1}
        position={[2.414, 80.425]}
      />
      <Glyph
        ref={terminal13b}
        color={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={glyph4p2}
        position={[4.725117, 80.425]}
      />
      <Glyph
        ref={terminal14}
        color={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={glyph5p1}
        position={[9.18, 81.482]}
      />
      <Path
        ref={path15}
        // rgb(100%,100%,100%)" d="M -35.518781 25.152594 C -44.128156 57.265875 -11.792219 53.941656 -28.218 25.496344 " />

        lineWidth={0.3985}
        scale={matrix15.scaling}
        position={matrix15.translation}
        rotation={matrix15.rotation}
        skew={[matrix15.skewX, matrix15.skewY]}
        lineCap={"butt"}
        lineJoin={"miter"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        lineDash={[2.78952, 1.59401]}
        data={"M -39.909406 10.105719 C -103.760969 -53.745844 -104.893781 88.371344 -41.323469 24.797125 "}
      // TODO miterlimit:10
      />
      <Path
        ref={path16}
        // rgb(100%,100%,100%)" d="M -2.072689 2.392432 C -1.694136 0.955585 -0.848525 0.280077 -0.000319632 -0.00150384 C -0.849891 -0.280036 -1.694767 -0.957308 -2.070622 -2.392207 " />

        lineWidth={0.3985}
        scale={matrix16.scaling}
        position={matrix16.translation}
        rotation={matrix16.rotation}
        skew={[matrix16.skewX, matrix16.skewY]}
        lineCap={"round"}
        lineJoin={"round"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={"M -2.07311 2.390239 C -1.694628 0.956672 -0.849365 0.277207 0.00140448 0.00102274 C -0.849342 -0.280758 -1.694547 -0.954771 -2.070145 -2.391132 "}
      // TODO miterlimit:10
      />
      <Path
        ref={path17}
        lineWidth={0.3985}
        scale={matrix17.scaling}
        position={matrix17.translation}
        rotation={matrix17.rotation}
        skew={[matrix17.skewX, matrix17.skewY]}
        lineCap={"butt"}
        lineJoin={"miter"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        lineDash={[2.78952, 1.59401]}
        data={"M 21.926531 11.230719 C 5.653094 2.297125 -9.62425 2.629156 -25.1555 12.051031 "}
      // TODO miterlimit:10
      />
      <Path
        ref={path18}
        lineWidth={0.3985}
        scale={matrix18.scaling}
        position={matrix18.translation}
        rotation={matrix18.rotation}
        skew={[matrix18.skewX, matrix18.skewY]}
        lineCap={"round"}
        lineJoin={"round"}
        stroke={"rgb(96.42334%,52.000427%,78.35083%)"}
        data={"M -2.073892 2.391692 C -1.691708 0.955831 -0.850953 0.277919 -0.000754398 -0.00132323 C -0.850912 -0.279485 -1.6931 -0.954893 -2.073322 -2.391796 "}
      // TODO miterlimit:10
      />

    </Rect>,
  );

  yield* terminal1().fadeIn(1.0);
  yield* terminal2().fadeIn(1.0);
  yield* terminal3().fadeIn(1.0);
  yield* terminal6().fadeIn(1.0);
  yield* terminal9().fadeIn(1.0);
  yield* terminal10().fadeIn(1.0);
  yield* terminal13a().fadeIn(1.0);
  yield* terminal13b().fadeIn(1.0);
  yield* terminal14().fadeIn(1.0);


  // terminal-1.svg -X
  // use glyph0p1:  style="fill:rgb(96.42334%,52.000427%,78.35083%);fill-opacity:1;"

  // terminal-2.svg -X
  // use glyph0p1: "fill:rgb(56.001282%,82.843018%,35.496521%);fill-opacity:1;" x="131.786" y="81.658"

  // terminal-3.svg: -X
  // use glyph1p1: fill: rgb(56.001282 %, 82.843018 %, 35.496521 %); fill - opacity: 1; x = "138.578" y = "78.042"

  // terminal-4.svg:
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(56.001282%,82.843018%,35.496521%);stroke-opacity:1;stroke-dasharray:2.78952,1.59401;stroke-miterlimit:10;" d="M -25.495344 21.234625 C -9.62425 30.863531 5.653094 31.195563 21.578875 22.453375 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-5.svg
  //    <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(56.001282%,82.843018%,35.496521%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.072826 2.392012 C -1.694403 0.955427 -0.850274 0.277938 0.00124617 0.00108884 C -0.851651 -0.279815 -1.692937 -0.955386 -2.073359 -2.389552 " transform="matrix(0.87663,0.48108,0.48108,-0.87663,126.84604,73.48473)" />

  // terminal-6.svg -X
  // fill:rgb(56.001282%,82.843018%,35.496521%);fill-opacity:1;
  //       <use xlink:href="#glyph2-1" x="101.289" y="64.653" />

  // terminal-7.svg
  // <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -33.268781 25.152594 C -33.628156 63.176031 31.129656 63.785406 31.481219 26.160406 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-8.svg
  // <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.072788 2.392088 C -1.691734 0.954783 -0.850355 0.278845 -0.00132533 0.00130758 C -0.8517 -0.279787 -1.694066 -0.955523 -2.070861 -2.38961 " transform="matrix(0.0094,0.99991,0.99991,-0.0094,136.57683,69.88415)" />

  // terminal-9.svg -X
  // fill:rgb(100%,100%,100%);fill-opacity:1;
  //       <use xlink:href="#glyph2-1" x="100.44" y="39.389" />

  // terminal-10.svg -X
  //  <g style="fill:;fill-opacity:1;">
  //  <use xlink:href="#glyph3-1" x="104.731" y="36.858" />

  // terminal-11.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(96.42334%,52.000427%,78.35083%);stroke-opacity:1;stroke-dasharray:2.78952,1.59401;stroke-miterlimit:10;" d="M -39.909406 10.105719 C -103.760969 -53.745844 -104.893781 88.371344 -41.323469 24.797125 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-12.svg
  // <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(96.42334%,52.000427%,78.35083%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.07311 2.390239 C -1.694628 0.956672 -0.849365 0.277207 0.00140448 0.00102274 C -0.849342 -0.280758 -1.694547 -0.954771 -2.070145 -2.391132 " transform="matrix(0.70706,0.70712,0.70712,-0.70706,63.90844,71.18723)" />

  // terminal-13.svg
  //  <g style="fill:rgb(96.42334%,52.000427%,78.35083%);fill-opacity:1;">
  //<use xlink:href="#glyph4-1" x="2.414" y="80.425" />
  //<use xlink:href="#glyph4-2" x="4.725117" y="80.425" />

  // terminal-14.svg
  // <g style="fill:rgb(96.42334%,52.000427%,78.35083%);fill-opacity:1;">
  // <use xlink:href="#glyph5-1" x="9.18" y="81.482" />

  // terminal-15.svg
  // <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -35.518781 25.152594 C -44.128156 57.265875 -11.792219 53.941656 -28.218 25.496344 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-16.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.072689 2.392432 C -1.694136 0.955585 -0.848525 0.280077 -0.000319632 -0.00150384 C -0.849891 -0.280036 -1.694767 -0.957308 -2.070622 -2.392207 " transform="matrix(-0.50002,0.866,0.866,0.50002,76.77458,70.52056)" />

  // terminal-17.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(96.42334%,52.000427%,78.35083%);stroke-opacity:1;stroke-dasharray:2.78952,1.59401;stroke-miterlimit:10;" d="M 21.926531 11.230719 C 5.653094 2.297125 -9.62425 2.629156 -25.1555 12.051031 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-18.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(96.42334%,52.000427%,78.35083%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.073892 2.391692 C -1.691708 0.955831 -0.850953 0.277919 -0.000754398 -0.00132323 C -0.850912 -0.279485 -1.6931 -0.954893 -2.073322 -2.391796 " transform="matrix(-0.85493,-0.51865,-0.51865,0.85493,79.7682,83.68824)" />

  // terminal-19.svg
  // <g style="fill:rgb(96.42334%,52.000427%,78.35083%);fill-opacity:1;">
  // <use xlink:href="#glyph2-2" x="100.703" y="96.751" />

  // terminal-20.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M 31.485125 10.105719 C 31.485125 -27.773187 -33.268781 -27.773187 -33.268781 9.707281 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-21.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.073919 2.389996 C -1.695012 0.956402 -0.851262 0.280621 0.0003 -0.00062875 C -0.851262 -0.277973 -1.695012 -0.95766 -2.073919 -2.391254 " transform="matrix(0,-1,-1,0,71.82359,85.9378)" />

  // terminal-22.svg
  //     <g style="fill:rgb(100%,100%,100%);fill-opacity:1;">
  // <use xlink:href="#glyph2-2" x="100.122" y="121.931" />

  // terminal-23.svg
  // <g style="fill:rgb(100%,100%,100%);fill-opacity:1;">
  // <use xlink:href="#glyph3-1" x="105.585" y="119.4" />

  // terminal-24.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(56.001282%,82.843018%,35.496521%);stroke-opacity:1;stroke-dasharray:2.78952,1.59401;stroke-miterlimit:10;" d="M 40.492937 25.761969 C 110.387469 95.644781 108.012469 -59.781 38.407 9.824469 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-25.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(56.001282%,82.843018%,35.496521%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.071455 2.391517 C -1.693054 0.957929 -0.84783 0.278415 0.000161746 -0.00057896 C -0.847838 -0.279549 -1.695843 -0.956277 -2.071523 -2.392616 " transform="matrix(-0.7071,-0.70708,-0.70708,0.7071,143.35908,85.87943)" />

  // terminal-26.svg
  // <g style="fill:rgb(56.001282%,82.843018%,35.496521%);fill-opacity:1;">
  // <use xlink:href="#glyph4-1" x="199.301" y="79.431" />
  // <use xlink:href="#glyph4-2" x="201.612117" y="79.431" />

  // terminal-27.svg
  //     <g style="fill:rgb(56.001282%,82.843018%,35.496521%);fill-opacity:1;">
  // <use xlink:href="#glyph5-1" x="206.067" y="81.235" />

  // terminal-28.svg
  //     <g style="fill:rgb(56.001282%,82.843018%,35.496521%);fill-opacity:1;">
  // <use xlink:href="#glyph3-1" x="211.189" y="79.796" />

  // terminal-29.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M 36.68825 25.761969 C 54.520281 56.640875 19.840594 60.203375 28.9695 26.144781 " transform="matrix(1,0,0,-1,105.093,95.844)" />

  // terminal-30.svg
  //     <path style="fill:none;stroke-width:0.3985;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M -2.072912 2.392252 C -1.693422 0.956008 -0.85204 0.277615 -0.000109826 0.000807192 C -0.850945 -0.276722 -1.692451 -0.957118 -2.072875 -2.391945 " transform="matrix(0.25882,0.96591,0.96591,-0.25882,134.11253,69.89094)" />

});
