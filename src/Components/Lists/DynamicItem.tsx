import React, { useState } from 'react';

function DynamicItem({name}:{name: string}) {

    const [CrossState, setCrossState] = useState(false);

    return (<p onClick={() => setCrossState(!CrossState)} className={CrossState ? "ListItem crossed" : "ListItem"} dir="auto">{name}</p>);
}
export default DynamicItem;