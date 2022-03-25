## How to write contents for Delta dashboard

### Prerequisites
This doc assumes that you already know how to write Markdown, and are familiar with the concept of Component. 

### Block

`Block` is a basic building 'block' for mdx contents. Any contents on mdx docs needs to be wrapped with `Block` component. The type of Block, and the combination of its children element will decide the layout of the content block. There are the 8 kinds of Blocks that we offer. When there is a layout change, you can assume that there is a change of block type. The image below shows what kind of blocks were used for each layout.

<table>
<tr>
<td>

![How it looks](./media/prose-figure.jpg)   
 </td>
 <td > 
 
 ![behind the scene](./media/prose-figure-w-quotation.jpg)   
  </td> 
</tr>
</table>


Only `Prose` and `Figure` can be direct children of Block. Any raw markdown contents can be wrapped with `Prose`, any media contents or custom components (Image, Map, Chart) should be wrapped with Figure. 


<table>
<tr>
<td> Type </td><td width='300px'> Syntax </td> <td> Result </td>
</tr>
<tr>
  <td> Default Prose Block </td>
  <td> 

  ```code
  <Block>
    <Prose>
      ### Your markdown header

      Your markdown contents comes here.
    </Prose>
  </Block>
  ```  
  </td> 
  <td>  

  ![Screenshot of Default Prose Block](./media/delta-default-prose.jpg)   
  </td>
</tr>

<tr>
  <td> Wide Prose Block </td>
  <td> 

  ```code
  <Block type='wide'>
    <Prose>
      ### Your markdown header

      Your markdown contents comes here.
    </Prose>
  </Block>
  ```  
  </td> 
  <td>  

  ![Screenshot of Wide Prose Block](./media/delta-wide-prose.jpg)
  </td>
</tr>

<tr>
  <td> Wide Figure Block </td>
  <td> 

  ```
  <Block type='wide'>
    <Figure>
      <Image ... />
      <Caption ...> caption </Caption>
    </Figure>
  </Block>
  ```

  </td> 
  <td>  

  ![Screenshot of Wide Figure Block](./media/delta-wide-figure.jpg)
  </td>
</tr>

<tr>
  <td> Full Figure Block </td>
  <td> 

  ```code
  <Block type='full'>
    <Figure>
      <Image ... />
      <Caption ...> caption </Caption>
    </Figure>
  </Block>
  ```
  </td> 
  <td>  

  ![Screenshot of Full Figure Block](./media/delta-full-figure.jpg)
  </td>
</tr>

<tr>
  <td> Prose Figure Block </td>
  <td> 

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
  </td> 
  <td>  
  
  ![Screenshot of Prose Figure Block](./media/delta-prose-figure.jpg)
  </td>
</tr>


<tr>
  <td> Figure Prose Block </td>
  <td> 

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
  </td> 
  <td>  

  ![Screenshot of Figure Prose Block](./media/delta-figure-prose.jpg)
  </td>
</tr>

<tr>
  <td> Prose Full Figure Block </td>
  <td> 

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
  </td> 
  <td>  

  ![Screenshot of prose full figure Block](./media/delta-prose-full-figure.jpg)
  </td>
</tr>

<tr>
  <td> Full Figure Prose Block </td>
  <td> 


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
  </td> 
  <td>  

  ![Screenshot of full figure prose Block](./media/delta-full-figure-prose.jpg)
  </td>
</tr>
</table>


### Image (inside of Prose)

You can use `Image` component to display any kind of image. If you need to put images inside of Prose block, there is an additional parameter, `align` that needs to be passed to decided alignment of image inside of paragraphs.

```
  <Image 
    src="http://via.placeholder.com/256x128?text=align-left" 
    alt="Media example" 
    align="left" 
    attr="example caption" 
    attrAuthor="penguin"
    attrUrl="https://linux.org"
    width="256" 
  />
```

There are two ways of putting caption for your image,

1. use attr props (recommended for inline image)

2. use Caption component (recommended for Figure )


#### Caption

```
  <Figure>
    <Image
      src='https://picsum.photos/id/1002/2048/1024'
      alt='Generic placeholder by lorem picsum'
    />
    <Caption 
      attrAuthor='somebody' 
      attrUrl='https://developmentseed.org'
    >
      This is an image.
    </Caption> 
  <Figure>
```

#### Map
### Chart


## Some gotachas

- Do not use H1 for your header. 