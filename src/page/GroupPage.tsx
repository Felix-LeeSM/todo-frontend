import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Button } from "@domain/shared/components/ui/button";
import { Calendar } from "@domain/shared/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@domain/shared/components/ui/dialog";
import { Input } from "@domain/shared/components/ui/input";
import { Label } from "@domain/shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@domain/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { Textarea } from "@domain/shared/components/ui/textarea";
import { TodoStatus } from "@domain/todo/types/TodoStatus";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, CheckCircle, GripVertical, Plus, Settings, Star } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function GroupPage() {
  const location = useLocation();

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "프로젝트 기획서 작성",
      description: "새 프로젝트의 기획서를 작성하고 팀원들과 공유",
      status: "in-progress",
      priority: "high",
      starred: true,
      dueDate: new Date(2024, 11, 25),
      assignee: "홍길동",
      createdAt: new Date(2024, 11, 20),
    },
    {
      id: "2",
      title: "UI 디자인 검토",
      description: "디자이너가 제출한 UI 디자인을 검토하고 피드백 제공",
      status: "todo",
      priority: "medium",
      starred: false,
      dueDate: new Date(2024, 11, 28),
      assignee: "김철수",
      createdAt: new Date(2024, 11, 21),
    },
    {
      id: "3",
      title: "데이터베이스 스키마 설계",
      description:
        "프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계프로젝트에 필요한 데이터베이스 스키마 설계",
      status: "completed",
      priority: "high",
      starred: true,
      dueDate: new Date(2024, 11, 22),
      assignee: "이영희",
      createdAt: new Date(2024, 11, 18),
    },
    {
      id: "4",
      title: "API 문서 작성",
      status: "todo",
      priority: "low",
      starred: false,
      dueDate: new Date(2024, 11, 30),
      assignee: "박민수",
      createdAt: new Date(2024, 11, 22),
    },
  ]);

  const [members] = useState<Member[]>([
    { id: "1", name: "김철수", role: "owner" },
    { id: "2", name: "홍길동", role: "admin" },
    { id: "3", name: "이영희", role: "member" },
    { id: "4", name: "박민수", role: "member" },
    { id: "5", name: "박민수", role: "member" },
    { id: "6", name: "박민수", role: "member" },
    { id: "7", name: "박민수", role: "member" },
  ]);

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: undefined as Date | undefined,
    assignee: "",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [customDays, setCustomDays] = useState(30);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [tempDays, setTempDays] = useState(30);
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const groupName = "팀 프로젝트 A";

  const handleCreateTodo = () => {
    if (newTodo.title.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        title: newTodo.title,
        description: newTodo.description,
        status: "todo",
        priority: newTodo.priority,
        starred: false,
        dueDate: newTodo.dueDate,
        assignee: newTodo.assignee,
        createdAt: new Date(),
      };
      setTodos([...todos, todo]);
      setNewTodo({
        title: "",
        description: "",
        priority: "medium",
        dueDate: undefined,
        assignee: "",
      });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleStar = (todoId: string) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, starred: !todo.starred } : todo)));
  };

  const updateTodoStatus = (todoId: string, newStatus: Todo["status"]) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, status: newStatus } : todo)));
  };

  const getFilteredTodos = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const customFromNow = new Date(today.getTime() + customDays * 24 * 60 * 60 * 1000);

    let filtered = todos;

    // 날짜 필터링
    switch (activeTab) {
      case "today":
        filtered = todos.filter((todo) => todo.dueDate && todo.dueDate.getTime() === today.getTime());
        break;
      case "week":
        filtered = todos.filter((todo) => todo.dueDate && todo.dueDate >= today && todo.dueDate <= weekFromNow);
        break;
      case "custom":
        filtered = todos.filter((todo) => todo.dueDate && todo.dueDate >= today && todo.dueDate <= customFromNow);
        break;
      default:
        filtered = todos;
    }

    // 담당자 필터링
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((todo) => todo.assignee === assigneeFilter);
    }

    return filtered;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "DONE":
        return "text-green-600 bg-green-50";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50";
      case "TO_DO":
        return "text-gray-600 bg-gray-50";
      case "ON_HOLD":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedTodo(todoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: Todo["status"]) => {
    e.preventDefault();
    if (draggedTodo) {
      updateTodoStatus(draggedTodo, newStatus);
      setDraggedTodo(null);
    }
  };

  const toggleDescription = (todoId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(todoId)) {
        newSet.delete(todoId);
      } else {
        newSet.add(todoId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/groups" className="text-blue-600 font-medium">
                그룹
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-gray-900">
                달력
              </Link>
              <Button variant="outline" size="sm" onClick={() => alert("로그아웃되었습니다!")}>
                로그아웃
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>홍</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">홍길동</p>
                  <p className="text-gray-500">Admin</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Group Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/groups" className="text-gray-500 hover:text-gray-700">
                그룹
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{groupName}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{groupName}</h1>
            <p className="text-gray-600">웹 애플리케이션 개발 프로젝트</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{members.length - 4}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/groups/${use(params).id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Link>
              </Button>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    할일 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>새 할일 추가</DialogTitle>
                    <DialogDescription>새로운 할일을 추가하고 팀원에게 할당하세요.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="todoTitle">제목</Label>
                      <Input
                        id="todoTitle"
                        placeholder="할일 제목을 입력하세요"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="todoDescription">설명 (선택사항)</Label>
                      <Textarea
                        id="todoDescription"
                        placeholder="할일에 대한 상세 설명을 입력하세요"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Select
                        value={newTodo.assignee}
                        onValueChange={(value) => setNewTodo((prev) => ({ ...prev, assignee: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>마감일 (선택사항)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTodo.dueDate ? format(newTodo.dueDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newTodo.dueDate}
                            onSelect={(date) => setNewTodo((prev) => ({ ...prev, dueDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        취소
                      </Button>
                      <Button onClick={handleCreateTodo}>할일 추가</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={activeTab === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("all")}>
              전체
            </Button>
            <Button
              variant={activeTab === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("today")}
            >
              오늘
            </Button>
            <Button
              variant={activeTab === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("week")}
            >
              이번주
            </Button>
            <Button
              variant={activeTab === "custom" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                if (!isEditingDays) {
                  setActiveTab("custom");
                }
              }}
            >
              {isEditingDays ? (
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={tempDays}
                  onChange={(e) => setTempDays(Number(e.target.value) || 30)}
                  onBlur={() => {
                    setCustomDays(tempDays);
                    setIsEditingDays(false);
                    setActiveTab("custom");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCustomDays(tempDays);
                      setIsEditingDays(false);
                      setActiveTab("custom");
                    }
                  }}
                  className="w-12 h-6 text-xs p-1 bg-transparent border-none text-center placeholder-gray-400"
                  placeholder="30"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempDays(customDays);
                    setIsEditingDays(true);
                  }}
                  className="cursor-pointer"
                >
                  {customDays}
                </span>
              )}
              <span onClick={() => setActiveTab("custom")} className="cursor-pointer">
                일 후까지
              </span>
            </Button>
          </div>

          {/* 담당자 필터 추가 */}
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium whitespace-nowrap">담당자:</Label>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Todo Column */}
          <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "todo")}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                할일 ({getFilteredTodos().filter((t) => t.status === "todo").length})
              </h3>
            </div>
            <div className="space-y-3">
              {getFilteredTodos()
                .filter((todo) => todo.status === "todo")
                .map((todo) => (
                  <Card
                    key={todo.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
                          {todo.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => toggleStar(todo.id)} className="p-1 h-auto">
                          <Star
                            className={`h-4 w-4 ${todo.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {todo.description && (
                        <div className="mb-3">
                          <p
                            className={`text-sm text-gray-600 ${
                              !expandedDescriptions.has(todo.id) && todo.description.length > 100 ? "line-clamp-2" : ""
                            }`}
                          >
                            {todo.description}
                          </p>
                          {todo.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => toggleDescription(todo.id)}
                            >
                              {expandedDescriptions.has(todo.id) ? "접기" : "더보기"}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* <Badge className={getPriorityColor(todo.priority)}>
                            {todo.priority === "high" ? "높음" : todo.priority === "medium" ? "보통" : "낮음"}
                          </Badge> */}
                          {todo.dueDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
                                  {format(todo.dueDate, "MM/dd", { locale: ko })}
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={todo.dueDate}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  날짜 설정
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        {todo.assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{todo.assignee.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "in-progress")}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                진행중 ({getFilteredTodos().filter((t) => t.status === "in-progress").length})
              </h3>
            </div>
            <div className="space-y-3">
              {getFilteredTodos()
                .filter((todo) => todo.status === "in-progress")
                .map((todo) => (
                  <Card
                    key={todo.id}
                    className="cursor-move hover:shadow-md transition-shadow border-blue-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
                          {todo.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => toggleStar(todo.id)} className="p-1 h-auto">
                          <Star
                            className={`h-4 w-4 ${todo.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {todo.description && (
                        <div className="mb-3">
                          <p
                            className={`text-sm text-gray-600 ${
                              !expandedDescriptions.has(todo.id) && todo.description.length > 100 ? "line-clamp-2" : ""
                            }`}
                          >
                            {todo.description}
                          </p>
                          {todo.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => toggleDescription(todo.id)}
                            >
                              {expandedDescriptions.has(todo.id) ? "접기" : "더보기"}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(todo.priority)}>
                            {todo.priority === "high" ? "높음" : todo.priority === "medium" ? "보통" : "낮음"}
                          </Badge>
                          {todo.dueDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
                                  {format(todo.dueDate, "MM/dd", { locale: ko })}
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={todo.dueDate}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  날짜 설정
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        {todo.assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{todo.assignee.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* On Hold Column */}
          <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "on-hold")}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Pause className="mr-2 h-4 w-4 text-orange-500" />
                보류 중 ({getFilteredTodos().filter((t) => t.status === "on-hold").length})
              </h3>
            </div>
            <div className="space-y-3">
              {getFilteredTodos()
                .filter((todo) => todo.status === "on-hold")
                .map((todo) => (
                  <Card
                    key={todo.id}
                    className="cursor-move hover:shadow-md transition-shadow border-orange-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
                          {todo.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => toggleStar(todo.id)} className="p-1 h-auto">
                          <Star
                            className={`h-4 w-4 ${todo.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {todo.description && (
                        <div className="mb-3">
                          <p
                            className={`text-sm text-gray-600 ${
                              !expandedDescriptions.has(todo.id) && todo.description.length > 100 ? "line-clamp-2" : ""
                            }`}
                          >
                            {todo.description}
                          </p>
                          {todo.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => toggleDescription(todo.id)}
                            >
                              {expandedDescriptions.has(todo.id) ? "접기" : "더보기"}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-50 text-orange-600">보류</Badge>
                          {todo.dueDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
                                  {format(todo.dueDate, "MM/dd", { locale: ko })}
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={todo.dueDate}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  날짜 설정
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        {todo.assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{todo.assignee.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "completed")}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                완료 ({getFilteredTodos().filter((t) => t.status === "completed").length})
              </h3>
            </div>
            <div className="space-y-3">
              {getFilteredTodos()
                .filter((todo) => todo.status === "completed")
                .map((todo) => (
                  <Card
                    key={todo.id}
                    className="cursor-move hover:shadow-md transition-shadow border-green-200 opacity-75"
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium flex items-center line-through text-gray-500">
                          <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
                          {todo.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => toggleStar(todo.id)} className="p-1 h-auto">
                          <Star
                            className={`h-4 w-4 ${todo.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {todo.description && (
                        <div className="mb-3">
                          <p
                            className={`text-sm text-gray-600 ${
                              !expandedDescriptions.has(todo.id) && todo.description.length > 100 ? "line-clamp-2" : ""
                            }`}
                          >
                            {todo.description}
                          </p>
                          {todo.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => toggleDescription(todo.id)}
                            >
                              {expandedDescriptions.has(todo.id) ? "접기" : "더보기"}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-50 text-green-600">완료</Badge>
                          {todo.dueDate ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
                                  {format(todo.dueDate, "MM/dd", { locale: ko })}
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={todo.dueDate}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  날짜 설정
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, dueDate: date } : t)));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        {todo.assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{todo.assignee.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
