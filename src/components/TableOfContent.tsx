import React, { useEffect, useState } from 'react';

// Function to generate a table of contents from the HTML string
function generateTableOfContents(htmlString: string): JSX.Element {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const headings = doc.querySelectorAll<HTMLHeadingElement>('h2');

    let currentLevel = 0;
    let currentList: JSX.Element[] = [];

    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        if (heading.textContent === "$nbsp;") {
            continue;
        }

        const level = parseInt(heading.tagName[1]);
        const id = `heading-${i}`; // Generate a unique ID for each heading
        heading.id = id; // Assign the generated ID to the heading

        const listItem = (
            <li key={id}>
                <a href={`#${id}`}>{heading.textContent}</a>
            </li>
        );

        if (level > currentLevel) {
            const newList = [listItem];
            currentList.push(
                <ul key={`ul-${i}`}>
                    {newList}
                </ul>
            );
            currentList = newList;
        } else if (level < currentLevel) {
            for (let j = level; j < currentLevel; j++) {
                currentList = currentList.slice(0, -1) as JSX.Element[];
            }
            currentList.push(listItem);
        } else {
            currentList.push(listItem);
        }

        currentLevel = level;
    }

    return <ul>{currentList}</ul>;
}

// Usage
const TableOfContents = ({ htmlString }: { htmlString: string }) => {
    const [toc, setToc] = useState<any>();

    useEffect(() => {
        setToc(generateTableOfContents(htmlString));
    }, [htmlString]); // Add 'htmlString' as a dependency in the array

    return <div className='space-y-5' id='toc'>{toc}</div>;
};

export default TableOfContents;
