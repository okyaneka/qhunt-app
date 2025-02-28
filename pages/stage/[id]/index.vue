<script setup lang="ts">
import { routes } from "~/_src/helpers";
import { setTitle } from "~/_src/helpers/common";

setTitle(`Stage`);
setTitle("Quests");
const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.replace(routes.stage.challenges(route.params.id as string));
});
</script>
