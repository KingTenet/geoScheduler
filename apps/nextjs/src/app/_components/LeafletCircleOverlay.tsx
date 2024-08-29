import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil } from "leaflet";

const Thing = Control.extend({
    onAdd: function () {
        const img = DomUtil.create("img");
        img.className = "circle-overlay";
        img.src = "circle.svg";
        img.oncontextmenu = (event) => event.preventDefault();
        return img;
    },

    onRemove: function () {},
});

export const LeafletCircleOverlay = createControlComponent(
    (props) => new Thing(props),
);
