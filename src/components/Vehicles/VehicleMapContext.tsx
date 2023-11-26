import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface VehicleRoutePair {
    marker: mapboxgl.Marker;
    routeId: string; // key of the route in the routes map
    vehicle: PTVechileProperties;
}

type VehicleMarkersContextType = {
    vehicleMarkers: Map<string, VehicleRoutePair>;
    setVehicleMarkers: Dispatch<SetStateAction<Map<string, VehicleRoutePair>>>;
};

type VehicleMarkersComponentProps = {
    children: ReactNode;
};

const VehicleMarkersContext = createContext<VehicleMarkersContextType | undefined>(undefined);

export const VehicleMarkersProvider: React.FC<VehicleMarkersComponentProps> = ({ children }) => {
    const [vehicleMarkers, setVehicleMarkers] = useState(new Map<string, VehicleRoutePair>());

    return (
        <VehicleMarkersContext.Provider value={{ vehicleMarkers, setVehicleMarkers }}>
            {children}
        </VehicleMarkersContext.Provider>
    );
};

export const useVehicleMarkers = (): VehicleMarkersContextType => {
    const context = useContext(VehicleMarkersContext);
    if (!context) {
        throw new Error('useVehicleMarkers must be used within a VehicleMarkersProvider');
    }
    return context;
};
