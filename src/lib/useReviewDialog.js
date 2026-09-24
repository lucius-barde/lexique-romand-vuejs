import { ref } from 'vue'
import { useAuth } from './useAuth'
import {
  getUserReviewForTerm,
  createReview,
  updateReview,
  deleteReview,
} from './reviews'

// Composable partagé pour gérer l'ouverture/fermeture de la boîte de dialogue
// "Ajouter un avis" / "Éditer votre avis", et la synchronisation du compteur
// de reviews affiché dans l'appelant (via le callback onCountChange).
export function useReviewDialog(onCountChange) {
  const { user } = useAuth()

  const dialogOpen = ref(false)
  const dialogTerm = ref(null)
  const dialogInitialValues = ref(null)
  const dialogLoading = ref(false)
  const dialogError = ref('')

  async function openDialog(term) {
    if (!user.value) {
      window.location.href = '/user/login'
      return
    }

    dialogTerm.value = term
    dialogError.value = ''
    dialogInitialValues.value = await getUserReviewForTerm(term.id, user.value.id)
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    dialogTerm.value = null
    dialogInitialValues.value = null
    dialogError.value = ''
  }

  async function submitDialog(values) {
    dialogLoading.value = true
    dialogError.value = ''
    try {
      const term = dialogTerm.value
      if (dialogInitialValues.value) {
        await updateReview(dialogInitialValues.value.id, values)
      } else {
        await createReview({
          ...values,
          term_id: term.id,
          author_id: user.value.id,
        })
        onCountChange?.(term.id, 1)
      }
      closeDialog()
    } catch (err) {
      dialogError.value = err.message || "Impossible d'enregistrer votre avis."
    } finally {
      dialogLoading.value = false
    }
  }

  async function deleteDialogReview() {
    dialogLoading.value = true
    dialogError.value = ''
    try {
      const term = dialogTerm.value
      await deleteReview(dialogInitialValues.value.id)
      onCountChange?.(term.id, -1)
      closeDialog()
    } catch (err) {
      dialogError.value = err.message || "Impossible de supprimer votre avis."
    } finally {
      dialogLoading.value = false
    }
  }

  return {
    dialogOpen,
    dialogInitialValues,
    dialogLoading,
    dialogError,
    openDialog,
    closeDialog,
    submitDialog,
    deleteDialogReview,
  }
}
