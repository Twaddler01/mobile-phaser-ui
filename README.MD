# Mobile Phaser UI

A reusable, mobile-first UI component and layout library for "Phaser 4" (https://phaser.io/).

"mobile-phaser-ui" is designed to make building responsive, nested game interfaces in Phaser feel more like working with a modern UI framework while remaining lightweight and Phaser-native.

The library is being developed with mobile and WebView-based Phaser applications in mind.

---

# Dev Notes (current WIP):
- Text updates, specifically wrapping and space in layout.

---

# Goals

The project focuses on:

- Mobile-first UI layouts
- Reusable Phaser components
- Nested component hierarchies
- Predictable parent/child sizing
- Automatic layout sizing
- Explicit fill behavior
- Padding, margins, and gaps
- Rows, columns, and grids
- Scrollable content
- Visual layout debugging
- Composable UI components

The goal is to provide a small set of reliable primitives that can be combined to create larger interfaces.

---

# Core Layout Philosophy

The most important rule in the library is:

«Children own their intrinsic size. Parents own the layout space they provide.»

A component has an intrinsic size:

width
height

A parent may assign a layout size:

layoutWidth
layoutHeight

The effective size used by the layout system is obtained through:

getLayoutWidth()
getLayoutHeight()

This distinction allows components to maintain their natural dimensions while still supporting responsive layouts.

---

# Intrinsic vs Assigned Size

For example:

const card = new Card(this.scene, {
    width: 300,
    height: 100
});

The Card's intrinsic size is:

300 × 100

Adding it normally:

parent.add(card);

allows it to retain its intrinsic size.

A parent can explicitly assign available space:

parent.add(card, {
    fill: 'horizontal'
});

The parent may then assign a layout width while the Card's intrinsic width remains unchanged.

Conceptually:

                 Intrinsic       Assigned

width              300             600
height             100             100

width            width            layoutWidth
height           height           layoutHeight

This distinction is intentional and is part of the library's layout contract.

---

# Layout Rules

## Parent

A parent controls:

- available space
- padding
- child positioning
- gaps
- alignment
- justification
- fill allocation

## Child

A child controls:

- intrinsic dimensions
- its own internal layout
- its content
- its children

Parent-assigned dimensions

A parent can assign dimensions using layout options such as:

fill: 'horizontal'
fill: 'vertical'
fill: 'both'

Without an explicit fill instruction, a child generally retains its intrinsic dimensions.

---

# Padding

Padding belongs to the parent and reduces the space available to its children.

const column = new Column(this.scene, {
    width: 600,
    height: 800,
    padding: 20
});

Conceptually:

┌──────────────────────────────┐
│  padding                     │
│   ┌──────────────────────┐   │
│   │                      │   │
│   │    child area        │   │
│   │                      │   │
│   └──────────────────────┘   │
│                     padding  │
└──────────────────────────────┘

---

# Margins

Margins belong to the child layout options and reserve space around the child.

parent.add(card, {
    margin: 20
});

Margins participate in:

- available space calculations
- positioning
- alignment
- automatic parent sizing

---

# Gaps

"gap" controls the space between siblings.

const column = new Column(this.scene, {
    gap: 20
});

┌──────────────┐
│    Child     │
├──────────────┤
│     20px     │
├──────────────┤
│    Child     │
├──────────────┤
│     20px     │
├──────────────┤
│    Child     │
└──────────────┘

---

# Layout Components

## Component

The base class for UI elements.

Responsibilities include:

- intrinsic dimensions
- assigned layout dimensions
- positioning
- child relationships
- layout invalidation
- content bounds
- debug bounds

---

# Container

Extends "Component" and provides child management and layout support.

Containers manage:

- child components
- parent/child relationships
- layout options
- padding and margins
- fill allocation
- layout invalidation

---

# Column

Arranges children vertically.

const column = new Column(this.scene, {
    width: 500,
    height: 600,
    padding: 20,
    gap: 10
});

Supported concepts include:

align:
    start
    center
    end

justify:
    start
    center
    end
    space-between
    space-around
    space-evenly

Example:

column.add(card, {
    fill: 'horizontal'
});

---

# Row

Arranges children horizontally.

const row = new Row(this.scene, {
    width: 500,
    height: 300,
    padding: 20,
    gap: 10
});

It follows the same layout concepts as "Column", with the primary axis reversed.

Column                    Row

Child                     Child Child Child
Child
Child

Supported concepts include:

align:
    start
    center
    end

justify:
    start
    center
    end
    space-between
    space-around
    space-evenly

The intent is for "Row" and "Column" to remain symmetrical and predictable.

---

# Grid

Arranges children into rows and columns.

const grid = new Grid(this.scene, {
    columns: 4,
    gap: 20
});

Grid is useful for:

- tiles
- inventory layouts
- card collections
- game boards
- icon collections
- other regular layouts

Grid cells can contain normal UI components and participate in the same parent/child sizing system.

---

# ScrollView

Provides a viewport for scrollable content.

const scroll = new ScrollView(this.scene, {
    width: 500,
    height: 400,
    direction: 'vertical'
});

Content is added as a normal component:

scroll.add(column);

The important distinction is:

ScrollView size
    =
viewport size

Content bounds
    =
scrollable content size

For example:

┌──────────────────────┐
│                      │
│      viewport        │
│                      │
│                      │
│                      │
└──────────────────────┘
          ↓
       scrolling
          ↓
┌──────────────────────┐
│       content        │
│                      │
│                      │
│                      │
│                      │
└──────────────────────┘

ScrollViews can also be nested inside other layout components.

Supported directions include:

vertical
horizontal
both

---

# Basic Components

The library currently includes or is developing simple reusable components such as:

- "Text"
- "Card"
- "Button"
- "Spacer"

These components are intended to use the same underlying layout system rather than implementing separate sizing rules.

---

# Debugging

The library includes a global debug system for visually inspecting component boundaries and layout calculations.

Debugging can display:

- component bounds
- parent bounds
- child layout areas
- margins
- layout rectangles
- fill areas

The goal is to make the layout hierarchy visible while developing.

Conceptually:

Parent
┌─────────────────────────────┐
│                             │
│   Child layout area         │
│   ┌─────────────────────┐   │
│   │       Child         │   │
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘

A single global debug configuration is used rather than requiring every component to individually enable debugging.

---

# Nested Layouts

Components are designed to be freely nested.

For example:

ScrollView
└── Column
    ├── Row
    │   ├── Button
    │   └── Button
    │
    ├── Card
    │
    └── Grid
        ├── Card
        ├── Card
        ├── Card
        └── Card

Each component participates in the same layout system.

A parent calculates the space available to its children, and each child can then perform its own layout.

---

# Layout Contract

The current layout system follows these principles:

1. Children have intrinsic dimensions.
2. Parents may assign layout dimensions.
3. "width" and "height" represent intrinsic/configured size.
4. "layoutWidth" and "layoutHeight" represent parent-assigned size.
5. "getLayoutWidth()" and "getLayoutHeight()" return the effective layout size.
6. Children are not automatically stretched unless a layout rule requires it.
7. "fill" explicitly allows a parent to allocate available space.
8. Padding belongs to the parent.
9. Margins belong to the child's placement within the parent.
10. Gaps belong to the parent and separate siblings.
11. Layout components should use the same rules regardless of where they are nested.
12. ScrollView viewport size and content size are separate concepts.
13. Components should remain composable rather than requiring special-case parent logic.

The central principle is:

«A parent controls the space it provides. A child controls what it naturally is.»

---

# Current Development Status

The core layout system currently includes:

- Component hierarchy
- Container hierarchy
- Intrinsic sizing
- Parent-assigned sizing
- Fill allocation
- Padding
- Margins
- Gaps
- Row layout
- Column layout
- Grid layout
- ScrollView layout
- Nested layouts
- Automatic sizing
- Content bounds
- Layout invalidation
- Visual debugging

The current focus is validating the layout system through increasingly comprehensive layout tests before expanding the widget library.

---

# Philosophy

"mobile-phaser-ui" is intentionally built from simple, composable pieces.

Rather than creating a large collection of specialized UI components, the project aims to establish a small number of predictable layout primitives that can be combined to create more complex interfaces.

Component
    ↓
Container
    ↓
Row / Column / Grid / ScrollView
    ↓
Text / Button / Card / etc.
    ↓
Application UI

The goal is a UI system where components can be nested freely and where their behavior remains predictable regardless of where they are placed.