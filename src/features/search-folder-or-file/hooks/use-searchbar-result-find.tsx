import { useDispatch, useSelector } from "react-redux";
import { resetSelectedData, selectedSearchResultSelector } from "../slice/selected-search-result-selector";
import { useCallback, useEffect, useState } from "react";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import { TourProps } from "antd";

const useSearchbarResultFind = () => {
  const dispatch = useDispatch();
  const { selectedDataId, fromLocation, startFinding, selectedDataType } = useSelector(selectedSearchResultSelector);
  const { parentFolderData } = useSelector(parentFolderSelector);

  const [shouldSearchElement, setShouldSearchElement] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  const { isMystorageLocation, isSubMyStorageLocation, isSharedWithMeLocation, isSubSharedWithMeLocation } = useDetectLocation();

  const isParentFolderExists = parentFolderData !== null;
  const isFromMyStorage = fromLocation === "my-storage";
  const isFromSharedWithMe = fromLocation === "shared-with-me";

  const isInRootMyStorageLocation = isFromMyStorage && isMystorageLocation;
  const isInSubMyStorageLocation = isFromMyStorage && isSubMyStorageLocation;
  const isInRootSharedWithMeLocation = isFromSharedWithMe && isSharedWithMeLocation;
  const isInSubSharedWithMeLocation = isFromSharedWithMe && isSubSharedWithMeLocation;
  const isInStarredLocation = !isParentFolderExists && fromLocation === "starred";
  const isInRecentlyViewedLocation = !isParentFolderExists && fromLocation === "recent";

  // Cek apakah lokasi sudah sesuai dan startFinding aktif
  useEffect(() => {
    const conditions = [
      isInRootMyStorageLocation,
      isInSubMyStorageLocation,
      isInRootSharedWithMeLocation,
      isInSubSharedWithMeLocation,
      isInStarredLocation,
      isInRecentlyViewedLocation,
    ];

    if (conditions.some(Boolean) && startFinding) setShouldSearchElement(true);
  }, [
    isInRecentlyViewedLocation,
    isInRootMyStorageLocation,
    isInRootSharedWithMeLocation,
    isInStarredLocation,
    isInSubMyStorageLocation,
    isInSubSharedWithMeLocation,
    startFinding,
  ]);

  // Tunggu 300ms sebelum mencari elemen agar lebih stabil
  useEffect(() => {
    if (!shouldSearchElement || !selectedDataId) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(selectedDataId) as HTMLElement | null;
      setSelectedElement(element);
    }, 300);

    return () => clearTimeout(timeout);
  }, [selectedDataId, shouldSearchElement]);

  // Menentukan langkah-langkah tur berdasarkan elemen yang ditemukan
  const steps: TourProps["steps"] = [
    {
      title: selectedElement ? `${selectedDataType} Found` : "Searching",
      description: selectedElement
        ? `Found the selected ${selectedDataType}`
        : `Searching for the selected ${selectedDataType}...`,
      target: selectedElement || (() => null),
      closable: false,
    },
  ];

  const handleCloseTour = useCallback(() => {
    dispatch(resetSelectedData());
    setShouldSearchElement(false);
    setSelectedElement(null);
  }, [dispatch]);

  return { isOpen: !!selectedElement, steps, handleCloseTour };
};

export default useSearchbarResultFind;
