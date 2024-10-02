import { Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: "Books",
          headerShown: false,
        }}
      />
      {/* 
  <Tabs.Screen
    name="home"
    options={{
      title: "Home",
      headerShown: false,
      tabBarIcon: ({ color, focused }) => (
        <TabIcon
          icon={icons.home}
          color={color}
          name="Home"
          focused={focused}
        />
      ),
    }}
  />
*/}
    </Tabs>
  );
};

export default TabLayout;
