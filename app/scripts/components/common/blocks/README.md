## How to write MDX contents for Delta dashboard
### Block

`Block` is a basic building block for mdx contents. Any contents on mdx docs needs to be wrapped with `Block` component. The type of Block, and the combination of its children element will decide the layout of the content block. There are the 8 kinds of Blocks that we offer. 


1. Default Prose Block
: Text contents block, with default container. If you have no opinion about what layout should be used for your contents, go with this default one. 

```
<Block>
  <Prose>
    Your markdown contents
  </Prose>
</Block>
```

2. Prose Wide Block
: Text contents block, with wider container and two columns. 

```
<Block type='wide'>
  <Prose>
    Your markdown contents
  </Prose>
<Block type>
```

3. Figure Wide Block
: Figure (Image, Chart, Map, other media) block with wider container. 

The example syntax below uses `Image` as its Figure content.
```
<Block type='wide'>
  <Figure>
    <Image ... />
    <Caption ...> caption </Caption>
  </Figure>
</Block>
```
4. Figure Full Block
: Figure (Image, Chart, Map, other media) block with full bleeding container. 

The example syntax below uses `Map` as its Figure Content
```
<Block type='full'>
  <Figure>
    <Map ... />
  </Figure>
</Block>
```
5. Figure + Prose Block
: A block that has two columns with wider container, one column for Figure and one column for Prose. 


The example syntax below puts Prose on left, Figure on right.
```
<Block>
  <Prose>
    My markdown contents
  </Prose>
  <Figure>
    <Image src='' />
    <Caption> caption </Caption>
  </Figure>
</Block>
```

The example syntax below puts Figure on left, Prose on right.
```
<Block>
  <Figure>
    <Image src='' />
    <Caption> caption </Caption>
  </Figure>
  <Prose>
    My markdown contents
  </Prose>
</Block>
```

6. Figure + Prose Full Block
: A block that has two uneven columns with one-side-full-bleeding container, one bleeding column for Figure and one restricted column for Prose. 


The example syntax below puts Prose on left, Figure on right bleeding to the end.
```
<Block type='full'>
  <Prose>
    My markdown contents
  </Prose>
  <Figure>
    <Image src='' />
    <Caption> caption </Caption>
  </Figure>
</Block>
```

The example syntax below puts  Figure on left bleeding to the end, Prose on left,
```
<Block type='full'>
  <Figure>
    <Image src='' />
    <Caption> caption </Caption>
  </Figure>
  <Prose>
    My markdown contents
  </Prose>
</Block>
```

### Prose

Prose is here to 

#### Image (inline)

### Figure

#### Image (as figure)

##### Caption

#### Map
### Chart

