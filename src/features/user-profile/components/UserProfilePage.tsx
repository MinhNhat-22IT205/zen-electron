import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/shadcn-ui/tabs";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import LikedPostList from "../../post/components/post-list/LikedPostList";
import CreatedPostList from "../../post/components/post-list/CreatedPostList";
import useFetchEndUser from "../hooks/useFetchEndUser";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { DotsHorizontalIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import EditProfileDialog from "./EditProfileDialog";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/shadcn-ui/card";
import { Label } from "@/src/shared/components/shadcn-ui/label";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Slider } from "@/src/shared/components/shadcn-ui/slider";
import { Switch } from "@/src/shared/components/shadcn-ui/switch";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/shared/components/shadcn-ui/alert";
import { useForm } from "react-hook-form";
import {
  zEditProfileInputs,
  ztEditProfileInputs,
} from "../lib/edit-profile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileInfo } from "../api/profile.api";
import {
  FormDescription,
  FormMessage,
} from "@/src/shared/components/shadcn-ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@/src/shared/components/shadcn-ui/form";
import { getImageDataObject } from "@/src/shared/helpers/get-image-data";
import { useToast } from "@/src/shared/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const { toast } = useToast();
  const { open, close, isOpen } = useDisclosure(false);
  const { id } = useParams<{ id: string }>();
  const authStore = useAuthStore((state) => state);
  const { endUser, isLoading } = useFetchEndUser(id);
  const [editedUser, setEditedUser] = useState(endUser);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setEditedUser((prev) => ({ ...prev, [name]: checked }));
  };

  const handleStorageChange = (value: number[]) => {
    setEditedUser((prev) => ({ ...prev, storageUsed: value[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated user data to your backend
    console.log("Updated user:", editedUser);
  };

  const handleLogout = () => {
    authStore.logout();
    navigate("/auth/login");
  };

  const [previews, setPreviews] = useState<string>("");

  const form = useForm<ztEditProfileInputs>({
    resolver: zodResolver(zEditProfileInputs),
    defaultValues: {
      username: authStore.endUser.username,
      description: authStore.endUser.description,
      avatar: "",
    },
  });

  const onSubmit = async (values: ztEditProfileInputs) => {
    const result = await editProfileInfo(values);
    authStore.setEndUser({
      ...authStore.endUser,
      username: values.username,
      description: values.description,
      avatar: result.avatar,
    });
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    <AvatarImage src={endUser.avatar} alt={endUser.username} />
                    <AvatarFallback>
                      {endUser.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <CardTitle className="text-2xl sm:text-3xl font-bold">
                      {endUser.username}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {endUser.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        {previews && (
                          <div className="mb-4 mx-auto">
                            <img
                              src={previews}
                              alt="Avatar Preview"
                              className="w-32 h-32 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <FormField
                          control={form.control}
                          name="avatar"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  {...rest}
                                  onChange={(event) => {
                                    const { file, displayUrl } =
                                      getImageDataObject(event);
                                    setPreviews(displayUrl);

                                    onChange(file);
                                  }}
                                />
                              </FormControl>
                              <FormDescription />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Username" {...field} />
                              </FormControl>
                              <FormDescription />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Description.."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          className="w-full"
                          variant={"default"}
                          type="submit"
                        >
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent value="settings">
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="storage">Storage Usage</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="storage"
                            max={100}
                            step={1}
                            value={[0]}
                            onValueChange={handleStorageChange}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {0} / {100} GB
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">
                          Enable Notifications
                        </Label>
                        <Switch
                          id="notifications"
                          checked={false}
                          onCheckedChange={handleSwitchChange(
                            "notificationsEnabled",
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="security">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="twoFactor">
                          Enable Two-Factor Authentication
                        </Label>
                        <Switch
                          id="twoFactor"
                          checked={false}
                          onCheckedChange={handleSwitchChange(
                            "twoFactorEnabled",
                          )}
                        />
                      </div>
                      <Alert>
                        {/* <AlertCircle className="h-4 w-4" /> */}
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Enabling two-factor authentication significantly
                          improves the security of your account.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("profile")}
                >
                  {/* <User className="w-4 h-4 mr-2" /> */}
                  View Profile
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  {/* <LogOut className="w-4 h-4 mr-2" /> */}
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
