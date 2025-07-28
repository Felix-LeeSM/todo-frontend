import { Button } from "@domain/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Textarea } from "@domain/shared/components/ui/textarea";
import { useEffect, useState } from "react";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import type { UpdateGroupRequestDTO } from "../types/dto/group.dto";
import type { Group } from "../types/Group";

interface GroupInfoEditorProps {
  group: Group;
  onUpdateGroup: (data: UpdateGroupRequestDTO) => Promise<void>;
}

export function GroupInfoEditor({ group, onUpdateGroup }: GroupInfoEditorProps) {
  const [formData, setFormData] = useState({ name: group.name, description: group.description });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({ name: group.name, description: group.description });
  }, [group]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    if (group.name === formData.name && group.description === formData.description) return;

    setIsLoading(true);

    onUpdateGroup(formData)
      .catch(toastErrorMessage)
      .finally(() => setIsLoading(false));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>그룹 정보</CardTitle>
        <CardDescription>그룹의 기본 정보를 수정할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">그룹 이름</Label>
            <Input id="group-name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">설명</Label>
            <Textarea
              id="group-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            변경사항 저장
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
