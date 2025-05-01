// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import STRING_CONSTANTS from '../strings/strings';
// import theme from '../utils/theme';

// const SwitchSelector = ({selectTab, onTabChange, windowWidth}) => {
//   const tabs = [
//     {id: 0, label: STRING_CONSTANTS.schedule, value: 'schedule'},
//     {id: 1, label: STRING_CONSTANTS.close, value: 'closed'},
//     // { id: 2, label: STRING_CONSTANTS.draft, value: '' },
//     {id: 3, label: STRING_CONSTANTS.decline, value: 'decline'},
//     {id: 4, label: STRING_CONSTANTS.suspend, value: 'suspend'},
//     {id: 5, label: STRING_CONSTANTS.all, value: ''},
//   ];

//   return (
//     <View style={styles.SwitchSelectorMainContainer}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.SwitchSelectorContainer}>
//         {tabs.map(tab => (
//           <TouchableOpacity
//             key={tab.id}
//             style={[
//               styles.tabButton,
//               {
//                 backgroundColor:
//                   selectTab === tab.id
//                     ? theme.colors.primary // Selected tab gets primary color
//                     : '#FFFFFF', // Unselected tabs get white
//                 minWidth: 100,
//               },
//             ]}
//             onPress={() => onTabChange(tab.value, tab.id)}>
//             <Text
//               style={[
//                 styles.tabText,
//                 {
//                   color:
//                     selectTab === tab.id
//                       ? '#FFFFFF' // White text for selected tab
//                       : '#000000', // Black text for unselected tab
//                 },
//               ]}>
//               {tab.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   SwitchSelectorMainContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   SwitchSelectorContainer: {
//     height: 45,
//     borderWidth: 0.5,
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#cccccc',
//     paddingHorizontal: 5,
//   },
//   tabButton: {
//     height: 35,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 3,
//   },
//   tabText: {
//     fontFamily: 'DMSans-Medium',
//     fontSize: 15,
//     paddingHorizontal: 10,
//   },
// });

// export default SwitchSelector;

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import STRING_CONSTANTS from '../strings/strings';
import theme from '../utils/theme';

const SwitchSelector = ({selectTab, onTabChange, windowWidth}) => {
  const tabs = [
    {id: 0, label: STRING_CONSTANTS.schedule, value: 'schedule'},
    {id: 1, label: STRING_CONSTANTS.close, value: 'closed'},
    {id: 2, label: STRING_CONSTANTS.draft, value: 'draft'},
    {id: 3, label: STRING_CONSTANTS.decline, value: 'decline'},
    {id: 4, label: STRING_CONSTANTS.suspend, value: 'suspend'},
    {id: 5, label: STRING_CONSTANTS.all, value: ''},
  ];

  // Dynamically calculate the width of each tab based on the screen width
  const tabWidth = windowWidth / tabs.length - 10; 

  return (
    <View style={styles.SwitchSelectorMainContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.SwitchSelectorContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  selectTab === tab.id
                    ? theme.colors.primary
                    : '#FFFFFF',
                width: tabWidth,
              },
            ]}
            onPress={() => onTabChange(tab.value, tab.id)}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectTab === tab.id
                      ? '#FFFFFF' 
                      : '#000000',
                },
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  SwitchSelectorMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  SwitchSelectorContainer: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#cccccc',
    paddingHorizontal: 5,
  },
  tabButton: {
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3, // Space between tabs
  },
  tabText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default SwitchSelector;
