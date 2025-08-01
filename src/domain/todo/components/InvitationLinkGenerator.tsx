import type { Invitation } from "@domain/group/types/Group";
import { Button } from "@domain/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Input } from "@domain/shared/components/ui/input";
import { Copy, LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastErrorMessage } from "@/shared/toastErrorMessage";

const generateInvitationUrl = (invitation: Invitation) => {
  return `${window.location.origin}/groups/invitation/${invitation.token}`;
};

interface InvitationLinkGeneratorProps {
  onCreateInvitation: () => Promise<Invitation>;
}

export function InvitationLinkGenerator({ onCreateInvitation }: InvitationLinkGeneratorProps) {
  const [invitationUrl, setInvitationUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    if (!invitationUrl) return;
    navigator.clipboard.writeText(invitationUrl);
    toast.info("초대 링크가 복사되었습니다.");
  };

  // [2] async/await를 사용하여 비동기 로직을 더 간결하고 직관적으로 만듭니다.
  const handleCreateInvitation = () => {
    if (isLoading) return;

    setIsLoading(true);

    onCreateInvitation()
      .then((invitation) => {
        setInvitationUrl(generateInvitationUrl(invitation));
      })
      .catch(toastErrorMessage)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>초대 링크</CardTitle>
          <CardDescription>이 링크를 공유하여 새로운 멤버를 초대하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input value={invitationUrl} readOnly placeholder="새 링크를 생성해주세요." className="flex-1" />
            <Button onClick={handleCopy} disabled={!invitationUrl} className="w-full sm:w-auto">
              <Copy className="mr-2 h-4 w-4" />
              복사
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={handleCreateInvitation}
            className="w-full sm:w-auto mt-4 bg-transparent"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            {isLoading ? "생성 중..." : "새 링크 생성"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
