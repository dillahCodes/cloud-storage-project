import { currentMessageSelector } from "@/features/message/slice/current-message-slice";
import AvatarOnlyIcon from "@components/layout/avatar/avatar-only-icon";
import AvatarWithUserPhoto from "@components/layout/avatar/avatar-with-user-photo";
import { Flex, Typography } from "antd";
import { useSelector } from "react-redux";
import { MdArrowDropDown } from "react-icons/md";
import createMessageTitle from "@/features/message/create-message-title";
import { useMemo } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Button from "@components/ui/button";
import formatDateFromEpoch from "@/util/format-date-from-epoch";

const { Text } = Typography;
const SenderProfileCardDekstop = () => {
  const { currentMessage, fetchStatus: currMessageFetchStatus, senderUserData } = useSelector(currentMessageSelector);

  const messageTitle = useMemo(() => {
    return currMessageFetchStatus && currentMessage ? createMessageTitle(currentMessage.type) : "";
  }, [currMessageFetchStatus, currentMessage]);

  const date = useMemo(
    () => (currentMessage ? formatDateFromEpoch(currentMessage.createdAt.seconds, currentMessage.createdAt.nanoseconds) : ""),
    [currentMessage]
  );

  return (
    <Flex align="center" gap="middle">
      <div className="self-end">
        {senderUserData?.photoURL ? <AvatarWithUserPhoto src={senderUserData?.photoURL} size={40} /> : <AvatarOnlyIcon size={40} />}
      </div>

      <Flex vertical gap="small" className="w-full">
        <Text className="font-[400] font-archivo text-xl">
          {messageTitle} {"-"} {senderUserData?.displayName}
        </Text>

        <Flex vertical className=" w-full">
          <Flex align="center">
            <Flex align="center" gap="small">
              <Text className="text-sm font-bold font-archivo line-clamp-1">{senderUserData?.displayName}</Text>
              <Text className="text-xs font-archivo line-clamp-1">
                {"<"}
                {senderUserData?.email}
                {">"}
              </Text>
            </Flex>
            <Flex align="center" className="ml-auto" gap="small">
              <Text className="text-xs">{date}</Text>
              <Button icon={<HiOutlineDotsVertical />} type="primary" className="text-black text-base rounded-sm" size="small" />
            </Flex>
          </Flex>

          <Flex align="center">
            <Text className="text-sm  font-archivo">to me</Text>
            <Text className="text-lg font-archivo">
              <MdArrowDropDown />
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SenderProfileCardDekstop;
