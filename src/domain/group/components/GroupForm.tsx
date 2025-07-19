import { Button } from "@domain/shared/components/ui/button";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Textarea } from "@domain/shared/components/ui/textarea";
import { useState } from "react";

export type GroupFormData = { name: string; description: string };
interface GroupFormProps {
  onSubmit: (formData: GroupFormData) => Promise<void>;
  onClose: () => void;
}

export default function GroupForm({ onSubmit, onClose }: GroupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData).then(() => {
      setFormData({ name: "", description: "" });
      onClose();
    });
  };

  return (
    <form>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="groupName">그룹 이름</Label>
          <Input
            id="groupName"
            placeholder="그룹 이름을 입력하세요"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groupDescription">설명 (선택사항)</Label>
          <Textarea
            id="groupDescription"
            placeholder="그룹에 대한 간단한 설명을 입력하세요"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onClose()}>
            취소
          </Button>
          <Button onClick={handleSubmit}>그룹 만들기</Button>
        </div>
      </div>
    </form>
  );
}
