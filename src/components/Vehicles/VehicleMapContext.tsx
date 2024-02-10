import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

import { vehicleTypes } from '../../data/data';
import { RootState, useAppSelector } from '../../store';

type VehicleMarkersContextType = {
    vehicleMarkers: Map<string, VehicleRoutePair>;
    setVehicleMarkers: Dispatch<SetStateAction<Map<string, VehicleRoutePair>>>;
    vehicleFilters: Map<string, VehicleFilter>;
    setVehicleFilters: Dispatch<SetStateAction<Map<string, VehicleFilter>>>;
    filteredRoutesId: Set<number>;
    setFilteredRoutesId: Dispatch<SetStateAction<Set<number>>>;
};

type VehicleMarkersComponentProps = {
    children: ReactNode;
};

const VehicleMarkersContext = createContext<VehicleMarkersContextType | undefined>(undefined);

export const VehicleMarkersProvider: React.FC<VehicleMarkersComponentProps> = ({ children }) => {
    const [vehicleMarkers, setVehicleMarkers] = useState(new Map<string, VehicleRoutePair>());
    const [vehicleFilters, setVehicleFilters] = useState(new Map<string, VehicleFilter>(vehicleTypes));

    const filteredRoutes = useAppSelector((state: RootState) => state.slice.filteredRoutes)
    const [filteredRoutesId, setFilteredRoutesId] = useState(new Set<number>(new Set(filteredRoutes.map((route) => route.properties.route_id))));

    return (
        <VehicleMarkersContext.Provider
            value={{ vehicleMarkers, setVehicleMarkers, vehicleFilters, setVehicleFilters, filteredRoutesId, setFilteredRoutesId }}
        >
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
