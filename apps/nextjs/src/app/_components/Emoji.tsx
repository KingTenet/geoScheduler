import React from "react";

const Emoji = React.memo(({ style, className, label, symbol }) => (
    <span style={style} className={className} role="img" aria-label={label}>
        {String.fromCodePoint(symbol)}
    </span>
));

export default Emoji;
