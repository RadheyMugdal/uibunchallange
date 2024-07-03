/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */

function hasNonEmptyText(element:HTMLElement):boolean {
  if(element.childElementCount===0  ){
    return element.textContent!.trim().length > 0;
  }
  return false;
}
function isNotInIgnoreList(element:HTMLElement):boolean {
  return !IGNORE_LIST.includes(element.tagName);
}

export function getTopLevelReadableElement(element:HTMLElement):boolean {
  if(element.tagName==='BODY'){
    return false;
  }
  if(!hasNonEmptyText(element) || !isNotInIgnoreList(element)) {
    return false;
  }
  if(element.parentElement && element.parentElement.childElementCount === 1 && element.parentElement.tagName!=='BODY' ) {
    return false;
  }
  const childrens:HTMLElement[] = Array.from(element.children as HTMLCollectionOf<HTMLElement>);
  for(const child of childrens) {
    if(!getTopLevelReadableElement(child)) {
      return false;
    }
  }
  return true;
}



export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const topLevelElements:HTMLElement[]=[];
  const body:HTMLElement = document.body;
  function traverse(element:HTMLElement){
    
    if(getTopLevelReadableElement(element)){
      topLevelElements.push(element);
    }else{
      if(!(!hasNonEmptyText(element) || !isNotInIgnoreList(element))) {
        if(element.parentElement && element.parentElement.childElementCount === 1 && element.parentElement.tagName!=='BODY' ) {
          let curr=element;
          while(curr.parentElement && curr.parentElement.childElementCount===1 && curr.parentElement.tagName!=='BODY'){
            curr=curr.parentElement;
          }
          if(curr.childElementCount===1 && curr.tagName!=='BODY' && !IGNORE_LIST.includes(curr.tagName)){
            if(!topLevelElements.includes(curr)){
              topLevelElements.push(curr);
            }
          }
        }
      }
      Array.from(element.children as HTMLCollectionOf<HTMLElement>).forEach(traverse);
    }

  } 
  traverse(body);
  return topLevelElements;
}



