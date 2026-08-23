let mainCursor;

const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

const cursorInit = () => {
  mainCursor?.destroy();
  mainCursor = new Cursor();
  return mainCursor;
};

class Cursor {
  constructor() {
    this.pos = { curr: null, prev: null };
    this.frame = null;
    this.create();
    this.init();
  }

  move(left, top) {
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  create() {
    this.cursor = document.createElement("div");
    this.cursor.id = "cursor";
    this.cursor.classList.add("xs-hidden", "hidden");
    document.body.append(this.cursor);

    this.style = document.createElement("style");
    this.style.textContent = `* { cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important; }`;
    document.head.append(this.style);
  }

  init() {
    this.handleMouseMove = (event) => {
      const position = { x: event.clientX - 8, y: event.clientY - 8 };
      if (!this.pos.curr) this.move(position.x, position.y);
      this.pos.curr = position;
      this.cursor.classList.remove("hidden");
      if (this.frame === null) this.render();
    };
    this.handleMouseEnter = () => this.cursor.classList.remove("hidden");
    this.handleMouseLeave = () => this.cursor.classList.add("hidden");
    this.handleMouseDown = () => this.cursor.classList.add("active");
    this.handleMouseUp = () => this.cursor.classList.remove("active");

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseenter", this.handleMouseEnter);
    document.addEventListener("mouseleave", this.handleMouseLeave);
    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  render = () => {
    this.frame = null;
    if (!this.pos.curr) return;

    const previous = this.pos.prev ?? this.pos.curr;
    const next = {
      x: lerp(previous.x, this.pos.curr.x, 0.35),
      y: lerp(previous.y, this.pos.curr.y, 0.35),
    };
    this.pos.prev = next;
    this.move(next.x, next.y);

    if (Math.abs(this.pos.curr.x - next.x) + Math.abs(this.pos.curr.y - next.y) > 0.1) {
      this.frame = requestAnimationFrame(this.render);
    }
  };

  destroy() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseenter", this.handleMouseEnter);
    document.removeEventListener("mouseleave", this.handleMouseLeave);
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
    this.cursor.remove();
    this.style.remove();
  }
}

export default cursorInit;
