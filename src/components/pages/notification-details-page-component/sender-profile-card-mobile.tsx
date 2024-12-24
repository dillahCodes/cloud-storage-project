import createMessageTitle from "@/features/message/create-message-title";
import { currentMessageSelector } from "@/features/message/slice/current-message-slice";
import formatDateFromEpoch from "@/util/format-date-from-epoch";
import AvatarOnlyIcon from "@components/layout/avatar/avatar-only-icon";
import AvatarWithUserPhoto from "@components/layout/avatar/avatar-with-user-photo";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";

const { Text } = Typography;
const SenderProfileCardMobile = () => {
  const { currentMessage, fetchStatus: currMessageFetchStatus, senderUserData } = useSelector(currentMessageSelector);

  const messageTitle = useMemo(() => {
    return currMessageFetchStatus && currentMessage ? createMessageTitle(currentMessage.type) : "";
  }, [currMessageFetchStatus, currentMessage]);

  const date = useMemo(
    () => (currentMessage ? formatDateFromEpoch(currentMessage.createdAt.seconds, currentMessage.createdAt.nanoseconds) : ""),
    [currentMessage]
  );
  return (
    <Flex className="w-full" vertical gap="middle">
      <Text className="font-[400] font-archivo text-xl">
        {messageTitle} {"-"} {senderUserData?.displayName}
      </Text>

      {/* profile data */}
      <Flex className="w-full" gap="middle">
        <div>
          {senderUserData?.photoURL ? <AvatarWithUserPhoto src={senderUserData?.photoURL} size={40} /> : <AvatarOnlyIcon size={40} />}
        </div>

        <Flex vertical className="w-full">
          <Flex vertical className="w-full">
            <Flex align="center" className=" w-full">
              <Text className="font-bold font-archivo text-sm">{senderUserData?.email}</Text>
              <Button icon={<HiOutlineDotsVertical />} type="primary" size="small" className="text-black text-base ml-auto rounded-sm" />
            </Flex>
            <Text className=" font-archivo text-xsm">{date}</Text>
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

export default SenderProfileCardMobile;
