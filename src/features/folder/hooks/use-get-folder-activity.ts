import { db } from "@/firebase/firebase-services";
import useDrawer from "@/hooks/use-drawer";
import formatTimestamp from "@/util/format-timestamp";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  ActivityAndUserData,
  ActivityGrouping,
  BaseFolderActivity,
  FolderActivityType,
  TimestampValue,
} from "../folder-activity";
import { setActivity, setErrorMessage, setStatusActivity } from "../slice/folder-activity-slice";

const useGetFolderActivity = () => {
  const dispatch = useDispatch();
  const { folderId: paramFolderId } = useParams<{ folderId: string }>();
  const { drawerState } = useDrawer();

  const selectedFolderId = useMemo(
    () => drawerState.desktopDrawerFolderId || paramFolderId,
    [drawerState.desktopDrawerFolderId, paramFolderId]
  );
  const isValidSelectedFolderId = useMemo(() => selectedFolderId && selectedFolderId.trim() !== "", [selectedFolderId]);

  const fetchFolderActivitiesCallback = useCallback(async () => {
    if (!isValidSelectedFolderId) return;

    try {
      dispatch(setStatusActivity("loading"));

      const activities = await fetchFolderAndChildActivities(selectedFolderId as string);
      const groupedActivities = await processActivities(activities);

      const mergedActivityDataGroupByDate = sortingGroupsActivities([
        ...groupedActivities.createFolderGroupByDate,
        ...groupedActivities.renameFolderGroupByDate,
        ...groupedActivities.deleteFolderGroupByDate,
      ]);

      dispatch(setActivity(mergedActivityDataGroupByDate));
      dispatch(setStatusActivity("succeeded"));
    } catch (error) {
      dispatch(setStatusActivity("error"));
      dispatch(setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  }, [selectedFolderId, isValidSelectedFolderId, dispatch]);

  useEffect(() => {
    fetchFolderActivitiesCallback();
  }, [fetchFolderActivitiesCallback]);
};

export default useGetFolderActivity;

/**
 * Fetches all activities under a given folder, including self activities and its child activities.
 *
 * @param folderId - The id of the folder to fetch activities from.
 * @returns A list of activities under the given folder, or an empty list if no activities are found.
 */
const fetchFolderAndChildActivities = async (folderId: string) => {
  const selfFolderActivity = await fetchActivitiesByFolderId(folderId);
  if (!selfFolderActivity) throw new Error("Failed to fetch folder activities.");

  const selfActivityCreatedFolder = selfFolderActivity.find((activity) => activity.type === "create-folder-activity");
  const childActivities = await fetchActivitiesRecursively(selfActivityCreatedFolder?.folderId as string);

  return [...selfFolderActivity, ...(childActivities || [])];
};

/**
 * Processes the activities and groups them by date and folderId.
 *
 * @param activities - List of activities to process.
 * @returns An object containing the grouped activities for create, rename, and delete folder activities.
 */
const processActivities = async (activities: BaseFolderActivity[]) => {
  const serializedData = handleSerializeActivityData(activities);
  const userIds = extractUserIdFromActivities(serializedData);
  const usersData = await handleFetchUsersDataByIds(userIds);

  if (!usersData) throw new Error("Failed to fetch users data.");

  return {
    createFolderGroupByDate: handleGroupedActivities(serializedData, "create-folder-activity", usersData),
    renameFolderGroupByDate: handleGroupedActivities(serializedData, "rename-folder-activity", usersData),
    deleteFolderGroupByDate: handleGroupedActivities(serializedData, "delete-folder-activity", usersData, false),
  };
};

/***
 * Handles the entire process of grouping activities by date and parentFolderId.
 *
 * @param activities - List of activities to process.
 * @param type - The type of activities to filter and group.
 * @param usersData - List of user data to map with activities.
 * @param withParentGroup - Whether to group activities by parentFolderId.
 * @returns A list of grouped activities with all processing applied.
 */
const handleGroupedActivities = (
  activities: BaseFolderActivity[],
  type: FolderActivityType,
  usersData: UserDataDb[],
  withParentGroup: boolean = true
): ActivityGrouping[] => {
  const filteredActivities = filterActivitiesByType(activities, type);
  const activityMap = groupActivitiesByDate(filteredActivities, usersData);
  const groupByDateResult = sortingGroupsActivities(Array.from(activityMap.values()));

  return withParentGroup ? processParentFolderGrouping(activityMap) : groupByDateResult;
};

/***
 * Filters activities by their type.
 *
 * @param activities - List of all activities.
 * @param type - The type to filter activities by.
 * @returns A filtered list of activities matching the given type.
 */
const filterActivitiesByType = (activities: BaseFolderActivity[], type: FolderActivityType): BaseFolderActivity[] => {
  return activities.filter((activity) => activity.type === type);
};

/***
 * Groups activities by their date.
 *
 * @param activities - List of activities to group.
 * @param usersData - List of user data to map with activities.
 * @returns A map of activities grouped by their date as the key.
 */
const groupActivitiesByDate = (activities: BaseFolderActivity[], usersData: UserDataDb[]): Map<string, ActivityGrouping> => {
  const activityMap = new Map<string, ActivityGrouping>();

  activities.forEach((activity) => {
    const activityDate = activity.activityDate as TimestampValue;
    const groupKey = `${formatTimestamp(activityDate.seconds)}_${activity.activityByUserId}`;
    const formattedDate = formatTimestamp(activityDate.seconds);

    if (!activityMap.has(groupKey)) {
      activityMap.set(groupKey, createActivityGroup(activity, formattedDate));
    }

    const activityAndUserData = mapActivityWithUser(activity, usersData);
    activityMap.get(groupKey)?.activities.push(activityAndUserData);
  });

  return activityMap;
};

/***
 * Creates a new activity group for a specific date.
 *
 * @param activity - The activity used to initialize the group.
 * @param formattedDate - The formatted date for the group.
 * @returns A new `ActivityGrouping` object.
 */
const createActivityGroup = (activity: BaseFolderActivity, formattedDate: string): ActivityGrouping => ({
  groupId: uuidv4(),
  groupByDate: formattedDate,
  groupTimeStamp: activity.activityDate as TimestampValue,
  groupType: activity.type,
  activities: [],
});

/***
 * Maps an activity with its associated user data.
 *
 * @param activity - The activity to map.
 * @param usersData - The list of user data to find the associated user.
 * @returns An object combining the activity and user data.
 */
const mapActivityWithUser = (activity: BaseFolderActivity, usersData: UserDataDb[]): ActivityAndUserData => ({
  activity,
  user: usersData.find((user) => user.uid === activity.activityByUserId) ?? null,
});

/***
 * Processes grouped activities to create sub-groups based on `parentFolderId`.
 *
 * @param activityMap - A map of activities grouped by date.
 * @returns A list of `ActivityGrouping` objects grouped further by `parentFolderId`.
 */
const processParentFolderGrouping = (activityMap: Map<string, ActivityGrouping>): ActivityGrouping[] => {
  const groupedActivities: ActivityGrouping[] = [];

  // Iterate through each group in the activity map
  for (const group of activityMap.values()) {
    const parentFolderGroups = groupByParentFolder(group);
    const updatedGroups = updateGroupTimestamps(parentFolderGroups);

    groupedActivities.push(...updatedGroups);
  }

  return sortAndOrganizeGroups(groupedActivities);
};

/**
 * Updates timestamps of parent folder groups to ensure uniqueness.
 *
 * @param parentFolderGroups - A map of parent folder groups to update.
 * @returns An array of ActivityGrouping with updated timestamps.
 */
const updateGroupTimestamps = (parentFolderGroups: Map<string, ActivityGrouping>): ActivityGrouping[] => {
  return Array.from(parentFolderGroups.values()).map((subGroup, index) => updateGroupTimestamp(subGroup, index + 1));
};

/***
 * Groups activities within a group by their `parentFolderId`.
 *
 * @param group - The group to process.
 * @returns A map of activities grouped by their `parentFolderId`.
 */
const groupByParentFolder = (group: ActivityGrouping): Map<string, ActivityGrouping> => {
  const parentFolderGroups = new Map<string, ActivityGrouping>();

  group.activities.forEach((item) => {
    const parentId = item.activity.parentFolderId || "null";

    if (!parentFolderGroups.has(parentId)) parentFolderGroups.set(parentId, createParentFolderGroup(group));

    parentFolderGroups.get(parentId)?.activities.push(item);
  });

  return parentFolderGroups;
};

/***
 * Creates a new group for a specific `parentFolderId`.
 *
 * @param group - The original group containing the activities.
 * @param parentId - The `parentFolderId` to group by.
 * @returns A new `ActivityGrouping` object.
 */
const createParentFolderGroup = (group: ActivityGrouping): ActivityGrouping => ({
  groupId: uuidv4(),
  groupByDate: group.groupByDate,
  groupTimeStamp: group.groupTimeStamp,
  groupType: group.groupType,
  activities: [],
});

/***
 * Updates the timestamp of a group to ensure uniqueness.
 *
 * @param group - The group to update.
 * @param increment - The increment to add to the timestamp.
 * @returns The updated group with a modified timestamp.
 */
const updateGroupTimestamp = (group: ActivityGrouping, increment: number): ActivityGrouping => ({
  ...group,
  groupTimeStamp: {
    seconds: (group.groupTimeStamp as TimestampValue).seconds + increment,
    nanoseconds: (group.groupTimeStamp as TimestampValue).nanoseconds,
  },
});

/***
 * Sorts and organizes activities within each group.
 *
 * @param groups - The list of groups to sort and organize.
 * @returns A sorted list of groups with sorted activities.
 */
const sortAndOrganizeGroups = (groups: ActivityGrouping[]): ActivityGrouping[] => {
  groups.forEach((group) => {
    group.activities = sortingActivities(group.activities);
  });
  return sortingGroupsActivities(groups);
};

/**
 * Sorts activity groups by their timestamps in descending order.
 *
 * @param data - Array of activity groups to sort.
 * @returns A sorted array of activity groups.
 */
const sortingGroupsActivities = (data: ActivityGrouping[]) => {
  return data.sort(
    (a, b) => ((b.groupTimeStamp as TimestampValue).seconds ?? 0) - ((a.groupTimeStamp as TimestampValue).seconds ?? 0)
  );
};

/**
 * Sorts individual activities by their timestamps in descending order.
 *
 * @param data - Array of activities to sort.
 * @returns A sorted array of activities.
 */
const sortingActivities = (data: ActivityAndUserData[]) => {
  return data.sort(
    (a, b) =>
      ((b.activity.activityDate as TimestampValue).seconds ?? 0) - ((a.activity.activityDate as TimestampValue).seconds ?? 0)
  );
};

/**
 * Serializes activity data by deep-cloning the activityDate field.
 *
 * @param activities - Array of activities to serialize.
 * @returns A new array of activities with serialized activityDate.
 */
const handleSerializeActivityData = (activities: BaseFolderActivity[]): BaseFolderActivity[] =>
  activities.map((activity) => ({
    ...activity,
    activityDate: JSON.parse(JSON.stringify(activity.activityDate)),
  }));

/**
 * Fetches user data for a given list of user IDs.
 *
 * @param userIds - Array of user IDs to fetch data for.
 * @returns A promise that resolves to an array of user data.
 */
const handleFetchUsersDataByIds = async (userIds: string[]): Promise<UserDataDb[]> => {
  const promises = userIds.map(async (userId) => {
    const userDcRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDcRef);
    return userSnapshot.exists() ? (userSnapshot.data() as UserDataDb) : null;
  });

  const usersData = await Promise.all(promises);
  return usersData.filter((user) => user !== null);
};

/**
 * Extracts unique user IDs from a list of activities.
 *
 * @param activities - Array of activities to extract user IDs from.
 * @returns A unique array of user IDs.
 */
const extractUserIdFromActivities = (activities: BaseFolderActivity[]): string[] => {
  const userIds = activities.filter((activity) => !!activity.activityByUserId).map((activity) => activity.activityByUserId);
  return Array.from(new Set(userIds));
};

/**
 * Fetches activities for a specific folder ID.
 *
 * @param folderId - The folder ID to fetch activities for.
 * @returns A promise that resolves to an array of activities or null if none exist.
 */
const fetchActivitiesByFolderId = async (folderId: string): Promise<BaseFolderActivity[] | null> => {
  const activityCollectionRef = collection(db, "folderActivities");
  const activityQuery = query(activityCollectionRef, where("folderId", "==", folderId));
  const activitySnapshot = await getDocs(activityQuery);
  return activitySnapshot.empty ? null : activitySnapshot.docs.map((doc) => doc.data() as BaseFolderActivity);
};

/**
 * Fetches activities for a specific parent folder ID.
 *
 * @param parentFolderId - The parent folder ID to fetch activities for.
 * @returns A promise that resolves to an array of activities or null if none exist.
 */
const fetchActivitiesByParentFolderId = async (parentFolderId: string): Promise<BaseFolderActivity[] | null> => {
  const activityCollectionRef = collection(db, "folderActivities");
  const activityQuery = query(activityCollectionRef, where("parentFolderId", "==", parentFolderId));
  const activitySnapshot = await getDocs(activityQuery);
  return activitySnapshot.empty ? null : activitySnapshot.docs.map((doc) => doc.data() as BaseFolderActivity);
};

/**
 * Checks if an activity is already present in the accumulator.
 *
 * @param accumulator - The list of accumulated activities.
 * @param activity - The activity to check for existence.
 * @returns A boolean indicating whether the activity exists in the accumulator.
 */
const isActivityInAccumulator = (accumulator: BaseFolderActivity[], activity: BaseFolderActivity): boolean => {
  return accumulator.some((existingActivity) => existingActivity.activityId === activity.activityId);
};

/**
 * Recursively fetches activities for a folder and its child folders.
 *
 * @param parentFolderId - The parent folder ID to start the recursive fetch.
 * @param accumulatedActivities - The accumulator to store fetched activities.
 * @returns A promise that resolves to a list of all accumulated activities.
 */
const fetchActivitiesRecursively = async (
  parentFolderId: string,
  accumulatedActivities: BaseFolderActivity[] = []
): Promise<BaseFolderActivity[]> => {
  const activities = await fetchActivitiesByParentFolderId(parentFolderId);

  if (activities) {
    // Add activities to the accumulator if not already present
    activities.forEach((activity) => {
      const isExists = isActivityInAccumulator(accumulatedActivities, activity);
      if (!isExists) accumulatedActivities.push(activity);
    });

    /**
     * Recursively fetch activities for child folders
     */
    const childActivityFolderId = activities.map((activity) => activity.folderId);
    for (const childFolderId of childActivityFolderId) {
      await fetchActivitiesRecursively(childFolderId, accumulatedActivities);
    }
  }

  return accumulatedActivities;
};
