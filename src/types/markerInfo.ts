export interface StandardMarker {
    id: string;
    coordinate: number[];
    categoryId: number;
    markerName: string;
}

export interface TextOverlayMarker {
    id: string;
    coordinate: number[];
    markerName: string;
    zoomRange: []
}

export interface ClusterGroupMarker {
    categoryId: number;
    coordinates: number[][];
}

export interface PathMarker {
    path: number[][];
    parentId: string;
}