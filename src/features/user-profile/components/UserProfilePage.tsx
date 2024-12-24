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
import {
  disableOtp,
  generateQr,
  verifyOtpToEnable2fa,
} from "../../authentication/api/auth.api";
import QrModal from "../../authentication/components/qrModal";
import OtpModal from "../../authentication/components/otpModal";

const UserProfilePage = () => {
  const { toast } = useToast();
  const { open, close, isOpen } = useDisclosure(false);
  const { id } = useParams<{ id: string }>();
  const authStore = useAuthStore((state) => state);
  const { endUser, isLoading } = useFetchEndUser(id);
  const [editedUser, setEditedUser] = useState(endUser);
  const [activeTab, setActiveTab] = useState("profile");
  const [qr, setQr] = useState<string>("");
  const [qrOpen, setQrOpen] = useState<boolean>(false);
  const [otpOpen, setOtpOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [disableOtpOpen, setDisableOtpOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleStorageChange = (value: number[]) => {
    setEditedUser((prev) => ({ ...prev, storageUsed: value[0] }));
  };

  const onHandle2fa = async (checked: boolean) => {
    if (!endUser.otpEnabled) {
      const result = await generateQr();
      setQr(result.qrUrl);
      setQrOpen(true);
    } else {
      setDisableOtpOpen(true);
    }
  };

  const handleVerifyOtp = async () => {
    const result = await verifyOtpToEnable2fa(otp, authStore.endUser.email);
    if (result.otpEnabled) {
      toast({
        title: "Two-factor authentication enabled",
        description: "You have successfully enabled two-factor authentication",
      });
      authStore.setEndUser(result);
      setOtpOpen(false);
      setOtp("");
      setQrOpen(false);
    } else {
      toast({
        title: "Failed to enable two-factor authentication",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDisableOtp = async () => {
    const result = await disableOtp(authStore.endUser.email, otp);
    if (result.otpEnabled === false) {
      setDisableOtpOpen(false);
      setOtpOpen(false);
      setOtp("");
      authStore.setEndUser(result);
      toast({
        title: "Two-factor authentication disabled",
        description: "You have successfully disabled two-factor authentication",
      });
    } else {
      toast({
        title: "Failed to disable two-factor authentication",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    console.log("logout");
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 animate-gradient-y flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="backdrop-blur-sm bg-white border border-amber-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="hover:bg-amber-100"
              >
                ← Back
              </Button>
            </div>
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={IMAGE_BASE_URL + endUser.avatar}
                      alt={endUser.username}
                    />
                    <AvatarFallback>
                      {endUser.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-amber-800">
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
                                  className="border-amber-200 focus:border-amber-400 file:bg-amber-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-amber-600 cursor-pointer hover:border-amber-400 transition-colors duration-200"
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
                                <Input
                                  placeholder="Username"
                                  {...field}
                                  className="border-amber-200 focus:border-amber-400"
                                />
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
                                  className="border-amber-200 focus:border-amber-400"
                                />
                              </FormControl>
                              <FormDescription />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600"
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
                        <Switch id="notifications" checked={false} />
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
                          checked={endUser.otpEnabled}
                          onCheckedChange={onHandle2fa}
                        />
                      </div>
                      <Alert>
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
                  className="hover:bg-amber-100"
                >
                  View Profile
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <QrModal
        qr={qr}
        open={qrOpen}
        setOpen={setQrOpen}
        setOtpOpen={setOtpOpen}
      />
      {/* Activate OTP */}
      <OtpModal
        open={otpOpen}
        setOpen={setOtpOpen}
        setOtp={setOtp}
        onSubmit={handleVerifyOtp}
        otp={otp}
      />
      {/* Disable OTP */}
      <OtpModal
        open={disableOtpOpen}
        setOpen={setDisableOtpOpen}
        setOtp={setOtp}
        onSubmit={handleDisableOtp}
        otp={otp}
      />
    </div>
  );
};

export default UserProfilePage;
